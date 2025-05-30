from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
import sqlite3

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    conn = sqlite3.connect("users.db")
    conn.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        username TEXT,
        password TEXT
    )
    """)
    return conn

class UserIn(BaseModel):
    email: str
    username: str
    password: str

class UserOut(BaseModel):
    email: str
    username: str

class LoginIn(BaseModel):
    email: str
    password: str

@router.post("/signup", response_model=UserOut)
def signup(user: UserIn):
    hashed = pwd_context.hash(user.password)
    conn = get_db()
    try:
        conn.execute("INSERT INTO users (email, username, password) VALUES (?, ?, ?)", (user.email, user.username, hashed))
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        conn.close()
    return UserOut(email=user.email, username=user.username)

@router.post("/login")
def login(data: LoginIn):
    conn = get_db()
    cur = conn.execute("SELECT password FROM users WHERE email=?", (data.email,))
    row = cur.fetchone()
    conn.close()
    if row and pwd_context.verify(data.password, row[0]):
        # In a real app, issue a JWT here!
        return {"success": True, "email": data.email}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/profile/{email}", response_model=UserOut)
def get_profile(email: str):
    conn = get_db()
    cur = conn.execute("SELECT email, username FROM users WHERE email=?", (email,))
    row = cur.fetchone()
    conn.close()
    if row:
        return UserOut(email=row[0], username=row[1])
    raise HTTPException(status_code=404, detail="User not found")
