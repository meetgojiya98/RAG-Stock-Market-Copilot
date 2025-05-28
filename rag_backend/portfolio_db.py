import sqlite3

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

def add_stock(user, symbol, shares):
    conn = get_db()
    conn.execute("INSERT INTO portfolio (user, symbol, shares) VALUES (?, ?, ?)", (user, symbol, shares))
    conn.commit()
    conn.close()

def get_portfolio(user):
    conn = get_db()
    cur = conn.execute("SELECT symbol, shares FROM portfolio WHERE user=?", (user,))
    data = cur.fetchall()
    conn.close()
    return [{"symbol": row[0], "shares": row[1]} for row in data]

def remove_stock(user, symbol):
    conn = get_db()
    conn.execute("DELETE FROM portfolio WHERE user=? AND symbol=?", (user, symbol))
    conn.commit()
    conn.close()
