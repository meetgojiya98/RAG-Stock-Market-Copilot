"use client";
import { useEffect, useState } from "react";
import NotificationsSocket from "./NotificationsSocket";

// Define the type for a notification object.
type Notification = {
  symbol: string;
  message: string;
  time: string;
  [key: string]: any;
};

const NotificationsList: React.FC = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setNotifs);
  }, []);

  return (
    <div>
      <NotificationsSocket onNotification={(n: Notification) => setNotifs(notifs => [n, ...notifs])} />
      <ul>
        {notifs.map((n: Notification, i: number) => (
          <li key={i} className="mb-2 border-b pb-2">
            <b>{n.symbol}</b>: {n.message} <span className="text-xs text-gray-500">{n.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsList;
