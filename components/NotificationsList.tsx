"use client";
import { useEffect, useState } from "react";
import NotificationsSocket from "./NotificationsSocket";

export default function NotificationsList() {
  const [notifs, setNotifs] = useState<any[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("http://localhost:8000/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setNotifs);
  }, []);
  return (
    <div>
      <NotificationsSocket onNotification={n => setNotifs(notifs => [n, ...notifs])} />
      <ul>
        {notifs.map((n, i) => (
          <li key={i} className="mb-2 border-b pb-2">
            <b>{n.symbol}</b>: {n.message} <span className="text-xs text-gray-500">{n.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
