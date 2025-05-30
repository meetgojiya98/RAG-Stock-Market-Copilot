"use client";
import { useEffect, useState } from "react";
import AdvancedAnalyticsPanel from "../../components/AdvancedAnalyticsPanel";

export default function AnalyticsPage() {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8000/portfolio", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolio(await res.json());
    };
    fetchPortfolio();
  }, []);

  return (
    <div className="max-w-xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Portfolio Analytics</h2>
      <AdvancedAnalyticsPanel portfolio={portfolio} />
    </div>
  );
}
