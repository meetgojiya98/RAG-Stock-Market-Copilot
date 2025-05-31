"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

// Type the stock prop. If you know more, update this type!
interface ChatRAGProps {
  stock: {
    symbol: string;
    [key: string]: any;
  };
}

export default function ChatRAG({ stock }: ChatRAGProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ q: string; a: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!query) return;
    setLoading(true);
    // Call your RAG backend here:
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: query, symbol: stock.symbol }),
    });
    const { answer } = await res.json();
    setMessages((prev) => [...prev, { q: query, a: answer }]);
    setQuery("");
    setLoading(false);
  }

  return (
    <div className="bg-white/95 rounded-2xl shadow-2xl p-8">
      <div className="flex gap-2 mb-4">
        <Input
          value={query}
          placeholder={`Ask anything about ${stock.symbol}...`}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleAsk(); }}
          disabled={loading}
        />
        <Button
          onClick={handleAsk}
          disabled={loading}
          className="bg-[#FFA500] text-black font-bold hover:bg-[#FFD580]"
        >
          {loading ? "..." : "Ask"}
        </Button>
      </div>
      <div>
        {messages.length === 0 && (
          <div className="text-gray-400 text-center py-6 italic">
            Start a conversation about {stock.symbol}!
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className="mb-6">
            <div className="font-semibold text-[#131D3B]">
              Q: <span>{m.q}</span>
            </div>
            <div className="ml-2 text-gray-700 border-l-2 border-[#FFA500] pl-2">
              A: {m.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}