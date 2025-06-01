"use client";
import AuthGuard from "../../components/AuthGuard";
import { useEffect, useState } from "react";
import AdvancedAnalyticsPanel from "../../components/AdvancedAnalyticsPanel";

export default function AnalyticsPage() {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/portfolio`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolio(await res.json());
    };
    fetchPortfolio();
  }, []);

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6">Portfolio Analytics</h2>
        <AdvancedAnalyticsPanel portfolio={portfolio} />
      </div>
    </AuthGuard>
  );
}
