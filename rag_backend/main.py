import requests
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this!
    allow_methods=["*"],
    allow_headers=["*"],
)

NEWSAPI_KEY = "29dd6c67091547f09cf3ac23fed871ef"

GROQ_API_KEY = "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"

@app.get("/price/{symbol}")
def get_price(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="2d")
        if hist.empty or 'Close' not in hist.columns:
            return {"price": None, "change": None}
        price = hist['Close'][-1]
        prev_close = hist['Close'][-2] if len(hist) > 1 else price
        change = price - prev_close
        return {"price": round(float(price), 2), "change": round(float(change), 2)}
    except Exception as e:
        return {"price": None, "change": None, "error": str(e)}

@app.get("/chart/{symbol}")
def get_chart(symbol: str):
    try:
        end = datetime.now()
        start = end - timedelta(days=30)
        ticker = yf.Ticker(symbol)
        hist = ticker.history(start=start, end=end, interval="1d")
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
    # Use company name or symbol as query; symbol works for major stocks
    url = f"https://newsapi.org/v2/everything?q={symbol}&apiKey={NEWSAPI_KEY}&sortBy=publishedAt&pageSize=5"
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
        "model": "llama3-8b-8192",  # or llama3-70b-8192, etc.
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