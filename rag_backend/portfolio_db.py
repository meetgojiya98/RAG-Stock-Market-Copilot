import sqlite3
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

def get_db():
    conn = sqlite3.connect("portfolio.db")
    conn.execute("""
    CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        symbol TEXT,
        shares REAL
    )""")
    return conn

class PortfolioIn(BaseModel):
    user: str
    symbol: str
    shares: float

@router.post("/portfolio/add")
def add_stock(item: PortfolioIn):
    conn = get_db()
    conn.execute("INSERT INTO portfolio (user, symbol, shares) VALUES (?, ?, ?)", (item.user, item.symbol, item.shares))
    conn.commit()
    conn.close()
    return {"success": True}

@router.get("/portfolio/{user}")
def get_portfolio(user: str):
    conn = get_db()
    cur = conn.execute("SELECT symbol, shares FROM portfolio WHERE user=?", (user,))
    data = cur.fetchall()
    conn.close()
    return [{"symbol": row[0], "shares": row[1]} for row in data]

@router.post("/portfolio/remove")
def remove_stock(item: PortfolioIn):
    conn = get_db()
    conn.execute("DELETE FROM portfolio WHERE user=? AND symbol=?", (item.user, item.symbol))
    conn.commit()
    conn.close()
    return {"success": True}
