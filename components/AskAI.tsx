"use client";
import React, { useState } from "react";

export default function AskAI({ askAI, aiAnswer, loading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      askAI(input);
    }
  };

  return (
    <div className="rounded-2xl shadow-xl p-8 flex flex-col h-56 justify-between bg-white/80 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-800 border border-zinc-100 dark:border-zinc-800 backdrop-blur">
      <h2 className="font-bold text-base mb-2 text-orange-600 dark:text-orange-400">
        Ask AI About Stocks
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 dark:bg-zinc-800 dark:text-white bg-zinc-50"
          placeholder="Ask about any stock..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-orange-400 to-yellow-400 dark:from-orange-500 dark:to-yellow-300 text-white dark:text-zinc-900 font-bold px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
          disabled={loading || !input.trim()}
        >
          Ask
        </button>
      </form>
      {/* Answer area with scrollable overflow */}
      <div className="flex-1 overflow-y-auto min-h-[1.5rem] max-h-[4.5rem] pr-1">
        {loading ? (
          <span className="text-gray-500 dark:text-gray-300">Thinking...</span>
        ) : aiAnswer ? (
          <div className="mt-1 text-zinc-900 dark:text-zinc-100 whitespace-pre-line break-words">{aiAnswer}</div>
        ) : null}
      </div>
    </div>
  );
}
