import os
import csv
import io
import json
from fastapi import FastAPI, Depends, HTTPException, status, Request, WebSocket, WebSocketDisconnect, UploadFile, File, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from sqlmodel import Field, Session, SQLModel, create_engine, select
from jose import JWTError, jwt
from datetime import datetime, timedelta
import sqlite3
import requests
import yfinance as yf
from dotenv import load_dotenv
from collections import defaultdict
from statistics import mean, stdev
from fastapi import Query

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env.local"))

SECRET_KEY = os.environ.get("SECRET_KEY", "CHANGE_THIS_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
NEWSAPI_KEY = os.environ.get("NEWSAPI_KEY", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

ALLOWED_ORIGINS = ["http://localhost:3000"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

sqlite_url = "sqlite:///./users.db"
engine = create_engine(sqlite_url, echo=False)

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str
    hashed_password: str
    username: str = ""

SQLModel.metadata.create_all(engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_email(email: str):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == email)).first()
        return user

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user

# ===== Real-Time Notifications (WebSockets) =====
active_connections = defaultdict(list)

@app.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket, token: str):
    user = None
    try:
        user = get_current_user(token)
        await websocket.accept()
        active_connections[user.email].append(websocket)
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if user:
            active_connections[user.email].remove(websocket)

def send_notification(user_email, symbol, message):
    payload = {
        "symbol": symbol,
        "message": message,
        "time": datetime.utcnow().isoformat(),
    }
    # Store in audit log:
    with sqlite3.connect("notifications.db") as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            symbol TEXT,
            message TEXT,
            time TEXT
        )""")
        conn.execute("INSERT INTO notifications (user, symbol, message, time) VALUES (?, ?, ?, ?)",
                     (user_email, symbol, message, payload["time"]))
        conn.commit()
    # Websocket live push
    for ws in list(active_connections.get(user_email, [])):
        try:
            import asyncio
            asyncio.create_task(ws.send_text(json.dumps(payload)))
        except:
            pass

# ===== Audit & History =====
def add_audit_event(user_email, typ, symbol, detail):
    with sqlite3.connect("audit.db") as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS audit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            type TEXT,
            symbol TEXT,
            detail TEXT,
            time TEXT
        )""")
        conn.execute("INSERT INTO audit (user, type, symbol, detail, time) VALUES (?, ?, ?, ?, ?)",
                     (user_email, typ, symbol, detail, datetime.utcnow().isoformat()))
        conn.commit()

@app.get("/audit")
def get_audit(current_user: User = Depends(get_current_user)):
    with sqlite3.connect("audit.db") as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS audit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            type TEXT,
            symbol TEXT,
            detail TEXT,
            time TEXT
        )""")
        cur = conn.execute("SELECT type, symbol, detail, time FROM audit WHERE user=? ORDER BY time DESC", (current_user.email,))
        return [{"type": row[0], "symbol": row[1], "detail": row[2], "time": row[3]} for row in cur.fetchall()]

# ===== Notifications (list) =====
@app.get("/notifications")
def get_notifications(current_user: User = Depends(get_current_user)):
    with sqlite3.connect("notifications.db") as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            symbol TEXT,
            message TEXT,
            time TEXT
        )""")
        cur = conn.execute("SELECT symbol, message, time FROM notifications WHERE user=? ORDER BY time DESC LIMIT 50", (current_user.email,))
        return [{"symbol": row[0], "message": row[1], "time": row[2]} for row in cur.fetchall()]

# ====== Portfolio ======
def get_portfolio_db():
    conn = sqlite3.connect("portfolio.db")
    conn.execute("""
    CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        symbol TEXT,
        shares REAL
    )""")
    return conn

@app.get("/portfolio")
def get_portfolio(current_user: User = Depends(get_current_user)):
    conn = get_portfolio_db()
    cur = conn.execute("SELECT symbol, shares FROM portfolio WHERE user=?", (current_user.email,))
    data = cur.fetchall()
    conn.close()
    return [{"symbol": row[0], "shares": row[1]} for row in data]

@app.post("/portfolio")
def add_stock(req: dict, current_user: User = Depends(get_current_user)):
    symbol = req.get("symbol")
    shares = req.get("shares")
    if not symbol or not shares:
        raise HTTPException(status_code=400, detail="Symbol and shares required")
    conn = get_portfolio_db()
    conn.execute("INSERT INTO portfolio (user, symbol, shares) VALUES (?, ?, ?)",
                 (current_user.email, symbol, shares))
    conn.commit()
    conn.close()
    add_audit_event(current_user.email, "Add", symbol, f"Added {shares} shares")
    send_notification(current_user.email, symbol, f"Added {shares} shares")
    return {"msg": "Stock added"}

@app.delete("/portfolio")
def remove_stock(symbol: str, current_user: User = Depends(get_current_user)):
    conn = get_portfolio_db()
    conn.execute("DELETE FROM portfolio WHERE user=? AND symbol=?", (current_user.email, symbol))
    conn.commit()
    conn.close()
    add_audit_event(current_user.email, "Remove", symbol, f"Removed from portfolio")
    send_notification(current_user.email, symbol, f"Removed from portfolio")
    return {"msg": "Stock removed"}

# === Bulk CSV Import/Export ===
@app.post("/portfolio/import")
async def import_portfolio(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    content = await file.read()
    reader = csv.DictReader(io.StringIO(content.decode("utf-8")))
    conn = get_portfolio_db()
    for row in reader:
        symbol = row.get("symbol")
        shares = row.get("shares")
        if symbol and shares:
            conn.execute("INSERT INTO portfolio (user, symbol, shares) VALUES (?, ?, ?)",
                         (current_user.email, symbol, shares))
    conn.commit()
    conn.close()
    add_audit_event(current_user.email, "Import", "", "Portfolio imported from CSV")
    return {"msg": "Portfolio imported"}

@app.get("/portfolio/export")
def export_portfolio(current_user: User = Depends(get_current_user)):
    conn = get_portfolio_db()
    cur = conn.execute("SELECT symbol, shares FROM portfolio WHERE user=?", (current_user.email,))
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["symbol", "shares"])
    for row in cur.fetchall():
        writer.writerow(row)
    conn.close()
    return Response(content=output.getvalue(), media_type="text/csv")

# ====== Watchlist ======
def get_watchlist_db():
    conn = sqlite3.connect("watchlist.db")
    conn.execute("""
    CREATE TABLE IF NOT EXISTS watchlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        symbol TEXT
    )""")
    return conn

@app.get("/watchlist")
def get_watchlist(current_user: User = Depends(get_current_user)):
    conn = get_watchlist_db()
    cur = conn.execute("SELECT symbol FROM watchlist WHERE user=?", (current_user.email,))
    data = cur.fetchall()
    conn.close()
    return [{"symbol": row[0]} for row in data]

@app.post("/watchlist")
def add_to_watchlist(req: dict, current_user: User = Depends(get_current_user)):
    symbol = req.get("symbol")
    if not symbol:
        raise HTTPException(status_code=400, detail="Symbol required")
    conn = get_watchlist_db()
    conn.execute("INSERT INTO watchlist (user, symbol) VALUES (?, ?)",
                 (current_user.email, symbol))
    conn.commit()
    conn.close()
    add_audit_event(current_user.email, "Watchlist Add", symbol, "Added to watchlist")
    return {"msg": "Watchlist updated"}

@app.delete("/watchlist")
def remove_from_watchlist(symbol: str, current_user: User = Depends(get_current_user)):
    conn = get_watchlist_db()
    conn.execute("DELETE FROM watchlist WHERE user=? AND symbol=?", (current_user.email, symbol))
    conn.commit()
    conn.close()
    add_audit_event(current_user.email, "Watchlist Remove", symbol, "Removed from watchlist")
    return {"msg": "Watchlist updated"}

# ====== Auth ======
@app.post("/auth/register")
async def register(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    username = data.get("username", "")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    if get_user_by_email(email):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = get_password_hash(password)
    with Session(engine) as session:
        db_user = User(email=email, hashed_password=hashed_pw, username=username)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return {"msg": "User created"}

@app.post("/auth/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(form.username)
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me")
def me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "username": current_user.username}

# ====== Profile (update username) ======
@app.post("/profile")
async def update_profile(request: Request, current_user: User = Depends(get_current_user)):
    data = await request.json()
    username = data.get("username")
    if not username:
        raise HTTPException(status_code=400, detail="Username required")
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == current_user.email)).first()
        user.username = username
        session.add(user)
        session.commit()
        session.refresh(user)
    return {"msg": "Profile updated", "username": username}

# ====== Price/Chart/News/Ask AI ======
@app.get("/price/{symbol}")
def get_price(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="2d")
        if hist.empty or 'Close' not in hist.columns:
            return {"price": None, "change": None}
        price = hist['Close'].iloc[-1]
        prev_close = hist['Close'].iloc[-2] if len(hist) > 1 else price
        change = price - prev_close
        return {"price": round(float(price), 2), "change": round(float(change), 2)}
    except Exception as e:
        return {"price": None, "change": None, "error": str(e)}

@app.get("/chart/{symbol}")
def get_chart(symbol: str, range: str = "1mo"):
    try:
        end = datetime.now()
        if range == "1mo":
            start = end - timedelta(days=30)
            interval = "1d"
        elif range == "6mo":
            start = end - timedelta(days=182)
            interval = "1d"
        elif range == "1y":
            start = end - timedelta(days=365)
            interval = "1d"
        elif range == "5y":
            start = end - timedelta(days=1825)
            interval = "1wk"
        else:  # max
            start = None
            interval = "1mo"
        ticker = yf.Ticker(symbol)
        if start:
            hist = ticker.history(start=start, end=end, interval=interval)
        else:
            hist = ticker.history(period="max", interval=interval)
        if hist.empty or 'Close' not in hist.columns:
            return {"data": []}
        data = [
            {"date": date.strftime("%Y-%m-%d"), "close": float(row["Close"])}
            for date, row in hist.iterrows()
        ]
        return {"data": data}
    except Exception as e:
        return {"data": [], "error": str(e)}

@app.get("/news/{symbol}")
def get_news(symbol: str):
    url = f"https://newsapi.org/v2/everything?q={symbol}&apiKey={NEWSAPI_KEY}&sortBy=publishedAt&pageSize=50"
    r = requests.get(url)
    data = r.json()
    articles = data.get("articles", [])
    news = [
        {
            "title": art.get("title"),
            "url": art.get("url"),
            "publishedAt": art.get("publishedAt"),
            "source": art.get("source", {}).get("name")
        }
        for art in articles
    ]
    return {"news": news}

@app.post("/ask")
async def ask_ai(req: Request):
    data = await req.json()
    query = data.get("query")
    symbol = data.get("symbol", "")
    prompt = f"Q: {query} (Stock symbol: {symbol})\nA:"

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful AI financial analyst."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 200,
        "temperature": 0.3,
    }

    resp = requests.post(url, headers=headers, json=payload)
    try:
        answer = resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        answer = "No answer."
    return {"answer": answer}

# ====== Advanced Analytics ======
@app.post("/analytics/advanced")
async def advanced_analytics(request: Request, current_user: User = Depends(get_current_user)):
    body = await request.json()
    symbols = body.get("symbols", [])
    allocation = body.get("allocation", {})
    metrics = {}
    sector_breakdown = {}
    # Calculate alpha, beta, sharpe, sector
    try:
        market = yf.Ticker("^GSPC")
        mkt_hist = market.history(period="1y")["Close"].pct_change().dropna().tolist()
        for symbol in symbols:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="1y")["Close"].pct_change().dropna().tolist()
            if len(hist) < 2 or len(mkt_hist) < 2:
                continue
            # Simple beta
            covar = sum((h - mean(hist)) * (m - mean(mkt_hist)) for h, m in zip(hist, mkt_hist)) / min(len(hist), len(mkt_hist))
            beta = covar / (stdev(mkt_hist) ** 2 if stdev(mkt_hist) else 1)
            alpha = (mean(hist) - mean(mkt_hist) * beta)
            sharpe = (mean(hist) / (stdev(hist) or 1)) * (252**0.5)
            metrics[symbol] = {"beta": beta, "alpha": alpha, "sharpe": sharpe}
            # Sector
            info = ticker.info
            sector = info.get("sector") or "Other"
            sector_breakdown[sector] = sector_breakdown.get(sector, 0) + float(allocation.get(symbol, 0))
    except Exception as e:
        return {"metrics": {}, "sector_breakdown": {}, "error": str(e)}
    return {"metrics": metrics, "sector_breakdown": sector_breakdown}

# ====== Trending Stocks (social) ======
@app.get("/trending")
def get_trending():
    with sqlite3.connect("portfolio.db") as conn:
        cur = conn.execute("SELECT symbol, COUNT(*) FROM portfolio GROUP BY symbol ORDER BY COUNT(*) DESC LIMIT 10")
        data = cur.fetchall()
    return [{"symbol": row[0], "count": row[1]} for row in data]

# ====== Demo user for quick tests ======
@app.on_event("startup")
def create_demo_user():
    email = "demo@example.com"
    password = "password123"
    username = "demo"
    if not get_user_by_email(email):
        hashed_pw = get_password_hash(password)
        with Session(engine) as session:
            db_user = User(email=email, hashed_password=hashed_pw, username=username)
            session.add(db_user)
            session.commit()
