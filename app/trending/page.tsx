"use client";
import AuthGuard from "../../components/AuthGuard";
import TrendingStocks from "../../components/TrendingStocks";
export default function TrendingPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6">Trending Stocks</h2>
        <TrendingStocks />
      </div>
    </AuthGuard>
  );
}
