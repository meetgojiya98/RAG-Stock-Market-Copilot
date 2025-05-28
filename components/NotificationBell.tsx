"use client";
import { useEffect, useState } from "react";

export default function NewsFeed() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    // Replace this with a real stock news API if you have one
    setNews([
      {
        title: "Apple Beats Q2 Earnings",
        url: "#",
        summary: "Apple reported record earnings this quarter driven by iPhone sales.",
      },
      {
        title: "Tesla Expands into India",
        url: "#",
        summary: "Tesla announces new gigafactory plans in Gujarat, India.",
      },
    ]);
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow border border-navy">
      <h3 className="font-bold text-navy mb-2">Market News</h3>
      <ul className="space-y-3">
        {news.map((item, i) => (
          <li key={i}>
            <a href={item.url} className="text-saffron font-semibold" target="_blank" rel="noopener noreferrer">{item.title}</a>
            <div className="text-xs text-gray-500">{item.summary}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
