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

    const apiBase =
    process.env.NEXT_PUBLIC_API_BASE?.replace(/^http/, "ws") ?? "ws://localhost:8000";
    const ws = new WebSocket(`${apiBase}/ws/notifications?token=${token}`);

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
