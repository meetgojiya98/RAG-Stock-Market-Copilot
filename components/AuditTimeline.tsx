"use client";
import { useEffect, useState } from "react";
export default function AuditTimeline() {
  const [timeline, setTimeline] = useState<any[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/audit`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setTimeline);
  }, []);
  return (
    <div>
      <ul>
        {timeline.map((e, i) => (
          <li key={i} className="mb-2 border-l-4 pl-2 border-orange-400">
            <b>{e.type}</b> — {e.symbol} — {e.detail} <span className="text-xs text-gray-500">{e.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
