"use client";
import React, { useState } from "react";

// Define types for props
interface AskAIProps {
  askAI: (q: string) => Promise<void>;
  aiAnswer: string;
  loading: boolean;
}

export default function AskAI({ askAI, aiAnswer, loading }: AskAIProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    askAI(input);
    setInput("");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6 w-full mt-4">
      <h3 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">
        Ask AI about this Stock
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          className="flex-1 rounded-l-lg px-3 py-2 border border-orange-300 dark:bg-zinc-800 dark:text-white"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this stock..."
          disabled={loading}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-r-lg bg-orange-600 text-white font-bold transition ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-700"
          }`}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      <div className="min-h-[2.5rem] text-gray-700 dark:text-gray-300">
        {aiAnswer}
      </div>
    </div>
  );
}
