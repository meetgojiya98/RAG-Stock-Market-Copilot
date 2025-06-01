"use client";
import { useEffect, useState } from "react";
import PortfolioTable from "../../components/PortfolioTable";
import AdvancedAnalyticsPanel from "../../components/AdvancedAnalyticsPanel";
import AuthGuard from "../../components/AuthGuard";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState([]);

  const fetchPortfolio = async () => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPortfolio(await res.json());
  };

  useEffect(() => { fetchPortfolio(); }, []);

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>
        <PortfolioTable onPortfolioChange={fetchPortfolio} />  
        <div className="mt-8">
          <AdvancedAnalyticsPanel portfolio={portfolio} />
        </div>
      </div>
    </AuthGuard>
  );
}
