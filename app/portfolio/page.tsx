"use client";
import { useEffect, useState } from "react";
import PortfolioTable from "../../components/PortfolioTable";
import AdvancedAnalyticsPanel from "../../components/AdvancedAnalyticsPanel";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState([]);

  const fetchPortfolio = async () => {
    const token = localStorage.getItem("access_token");
    const res = await fetch("http://localhost:8000/portfolio", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPortfolio(await res.json());
  };

  useEffect(() => { fetchPortfolio(); }, []);

  return (
    <div className="max-w-xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>
      <PortfolioTable onChange={fetchPortfolio} />
    </div>
  );
}
