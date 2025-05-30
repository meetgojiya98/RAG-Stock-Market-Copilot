"use client";
import { useEffect } from "react";
export default function NotificationsSocket({ onNotification }) {
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const ws = new WebSocket(`ws://localhost:8000/ws/notifications?token=${token}`);
    ws.onmessage = (event) => {
      try { onNotification(JSON.parse(event.data)); } catch {}
    };
    return () => ws.close();
  }, [onNotification]);
  return null;
}
