"use client";
import { useRef } from "react";
export default function PortfolioCSVManager({ onImported }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await fetch("http://localhost:8000/portfolio/import", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      body: formData,
    });
    onImported();
  };

  const handleExport = () => {
    fetch("http://localhost:8000/portfolio/export", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "portfolio.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  return (
    <div className="flex gap-3 items-center mb-4">
      <input type="file" accept=".csv" ref={fileRef} style={{ display: "none" }} onChange={handleImport} />
      <button onClick={() => fileRef.current?.click()} className="bg-blue-500 text-white px-3 py-1 rounded">Import CSV</button>
      <button onClick={handleExport} className="bg-green-500 text-white px-3 py-1 rounded">Export CSV</button>
    </div>
  );
}
