"use client";
import AuthGuard from "../../components/AuthGuard";
import WatchlistPanel from "../../components/WatchlistPanel";

export default function WatchlistPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <WatchlistPanel />
      </div>
    </AuthGuard>
  );
}
