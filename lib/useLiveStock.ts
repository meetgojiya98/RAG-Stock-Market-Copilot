"use client";
import { useEffect, useState } from "react";

export function useLiveStock(symbol: string) {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    // Replace with your actual endpoint:
    const ws = new WebSocket("wss://ws.finnhub.io?token=YOUR_FINNHUB_API_KEY");
    ws.onopen = () => ws.send(JSON.stringify({ type: "subscribe", symbol }));

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.data && data.data[0]?.s === symbol) {
          setPrice(data.data[0].p);
        }
      } catch {}
    };

    return () => {
      ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
      ws.close();
    };
  }, [symbol]);

  return price;
}
