from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/price")
async def price_ws(websocket: WebSocket):
    await websocket.accept()
    while True:
        price = round(150 + random.random()*10, 2)
        await websocket.send_json({"symbol": "AAPL", "price": price})
        await asyncio.sleep(1)
