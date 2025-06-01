"use client";
import { useEffect } from "react";

// Type definition for props
type Props = {
  onNotification: (notification: any) => void;
};

const NotificationsSocket: React.FC<Props> = ({ onNotification }) => {
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const wsUrl =
      process.env.NODE_ENV === "development"
        ? `ws://localhost:8000/ws/notifications?token=${token}`
        : `wss://stock-market-copilot.onrender.com/ws/notifications?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        onNotification(JSON.parse(event.data));
      } catch (err) {
        // Optionally log error
      }
    };
    return () => {
      ws.close();
    };
  }, [onNotification]);
  return null;
};

export default NotificationsSocket;
