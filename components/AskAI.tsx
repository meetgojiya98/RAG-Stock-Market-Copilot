import React, { useState } from "react";

export default function AskAI({ askAI, aiAnswer, loading }) {
  const [input, setInput] = useState("");
  return (
    <div className="bg-white p-4 rounded shadow h-64 flex flex-col">
      <h2 className="font-bold text-red-700 mb-2">Ask AI About Stocks</h2>
      <div className="flex mb-2">
        <input
          type="text"
          className="flex-1 border px-2 py-1 rounded mr-2"
          value={input}
          placeholder="Ask about any stock..."
          onChange={e => setInput(e.target.value)}
        />
        <button
          className="bg-orange-600 text-white px-3 py-1 rounded"
          onClick={() => { askAI(input); setInput(""); }}
          disabled={loading}
        >
          Ask
        </button>
      </div>
      <div className="overflow-y-auto text-sm">
        {loading ? "Loading..." : aiAnswer || "No answer."}
      </div>
    </div>
  );
}
