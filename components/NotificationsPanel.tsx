"use client";
import { useEffect, useState, useRef } from "react";

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const ws = useRef(null);

  // Fetch latest notifications on load
  const fetchNotifications = async () => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications(await res.json());
  };

  useEffect(() => {
    fetchNotifications();
    // Live notifications via websocket!
    const token = localStorage.getItem("access_token");
    ws.current = new WebSocket(`ws://localhost:8000/ws/notifications?token=${token}`);
    ws.current.onmessage = event => {
      const notif = JSON.parse(event.data);
      setNotifications(prev => [{ ...notif }, ...prev]);
    };
    return () => ws.current?.close();
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow text-black dark:text-white">
      <h3 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">Notifications & Alerts</h3>
      {notifications.length === 0 && (
        <div className="text-gray-500 dark:text-gray-400">No notifications yet. Wait for a price alert or portfolio event!</div>
      )}
      <ul className="space-y-2">
        {notifications.map((n, i) => (
          <li key={i} className="border-b border-zinc-200 dark:border-zinc-800 pb-2 text-sm">
            <b>{n.symbol}</b> — {n.message}{" "}
            <span className="text-gray-400 dark:text-gray-500">({new Date(n.time).toLocaleString()})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
