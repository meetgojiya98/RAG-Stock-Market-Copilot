"use client";
import WatchlistPanel from "../../components/WatchlistPanel";
import AuthGuard from "../../components/AuthGuard";

export default function WatchlistPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <WatchlistPanel />
      </div>
    </AuthGuard>
  );
}
