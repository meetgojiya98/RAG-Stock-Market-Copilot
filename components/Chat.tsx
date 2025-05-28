"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ q: string; a: string }>>([]);

  const handleAsk = async () => {
    if (!query) return;
    // TODO: Hook up with RAG backend
    setMessages((prev) => [...prev, { q: query, a: "This is a placeholder answer. (RAG backend will answer here)" }]);
    setQuery("");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mt-8">
      <h3 className="font-semibold mb-4">Ask a Stock Market Question</h3>
      <div className="flex space-x-2 mb-4">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. What's the bull case for AAPL?" />
        <Button onClick={handleAsk}>Ask</Button>
      </div>
      <div>
        {messages.map((m, i) => (
          <div key={i} className="mb-4">
            <div className="font-bold">Q: {m.q}</div>
            <div className="ml-2 text-gray-700">A: {m.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
