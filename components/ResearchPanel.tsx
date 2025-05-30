// "use client";
// import { useEffect, useState } from "react";

// export default function ResearchPanel() {
//   const [symbol, setSymbol] = useState("AAPL");
//   const [news, setNews] = useState([]);
//   const [query, setQuery] = useState("");
//   const [aiAnswer, setAiAnswer] = useState("");
//   const [loading, setLoading] = useState(false);

//   // News fetch
//   useEffect(() => {
//     if (!symbol) return;
//     fetch(`http://localhost:8000/news/${symbol}`)
//       .then(r => r.json())
//       .then(data => setNews(data.news || []));
//   }, [symbol]);

//   // Ask AI
//   const handleAsk = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setAiAnswer("");
//     const token = localStorage.getItem("access_token");
//     const res = await fetch("http://localhost:8000/ask", {
//       method: "POST",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ query, symbol }),
//     });
//     const data = await res.json();
//     setAiAnswer(data.answer || "No answer.");
//     setLoading(false);
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow">
//       <h3 className="font-semibold mb-3 text-orange-700">Research & Discovery</h3>
//       <div className="mb-6">
//         <label className="font-semibold">Stock Symbol for News:</label>
//         <input
//           className="border px-2 py-1 rounded ml-2"
//           value={symbol}
//           onChange={e => setSymbol(e.target.value.toUpperCase())}
//           placeholder="e.g. AAPL"
//         />
//         <div className="mt-2">
//           {news.length === 0 ? (
//             <span className="text-gray-500">No news available.</span>
//           ) : (
//             <ul className="space-y-1">
//               {news.slice(0, 5).map((n, i) => (
//                 <li key={i} className="text-sm">
//                   <a href={n.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{n.title}</a>
//                   <span className="text-gray-400 ml-1">({n.source}, {new Date(n.publishedAt).toLocaleDateString()})</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//       <div>
//         <form onSubmit={handleAsk} className="flex gap-2 mb-2">
//           <input
//             className="border px-2 py-1 rounded flex-1"
//             value={query}
//             onChange={e => setQuery(e.target.value)}
//             placeholder="Ask about any stock..."
//           />
//           <button type="submit" className="bg-orange-500 text-white px-4 py-1 rounded" disabled={loading || !query}>Ask</button>
//         </form>
//         {loading && <div className="text-gray-500">AI is thinking...</div>}
//         {aiAnswer && <div className="bg-gray-100 p-2 rounded">{aiAnswer}</div>}
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";

export default function ResearchPanel() {
  const [symbol, setSymbol] = useState("AAPL");
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // News fetch
  useEffect(() => {
    if (!symbol) return;
    fetch(`http://localhost:8000/news/${symbol}`)
      .then(r => r.json())
      .then(data => setNews(data.news || []));
  }, [symbol]);

  // Ask AI
  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiAnswer("");
    const token = localStorage.getItem("access_token");
    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query, symbol }),
    });
    const data = await res.json();
    setAiAnswer(data.answer || "No answer.");
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow text-black dark:text-white">
      <h3 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">Research & Discovery</h3>
      <div className="mb-6">
        <label className="font-semibold text-black dark:text-white">Stock Symbol for News:</label>
        <input
          className="border px-2 py-1 rounded ml-2 bg-white dark:bg-zinc-800 text-black dark:text-white"
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          placeholder="e.g. AAPL"
        />
        <div className="mt-2">
          {news.length === 0 ? (
            <span className="text-gray-500 dark:text-gray-400">No news available.</span>
          ) : (
            <ul className="space-y-1">
              {news.slice(0, 5).map((n, i) => (
                <li key={i} className="text-sm">
                  <a href={n.url} className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">{n.title}</a>
                  <span className="text-gray-400 dark:text-gray-400 ml-1">({n.source}, {new Date(n.publishedAt).toLocaleDateString()})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div>
        <form onSubmit={handleAsk} className="flex gap-2 mb-2">
          <input
            className="border px-2 py-1 rounded flex-1 bg-white dark:bg-zinc-800 text-black dark:text-white"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask about any stock..."
          />
          <button type="submit" className="bg-orange-500 text-white px-4 py-1 rounded" disabled={loading || !query}>Ask</button>
        </form>
        {loading && <div className="text-gray-500 dark:text-gray-400">AI is thinking...</div>}
        {aiAnswer && <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded text-black dark:text-white">{aiAnswer}</div>}
      </div>
    </div>
  );
}
