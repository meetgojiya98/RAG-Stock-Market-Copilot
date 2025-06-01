"use client";
import AuthGuard from "../../components/AuthGuard";
import WatchlistPanel from "../../components/WatchlistPanel";

export default function WatchlistPage() {
  return (
    <AuthGuard>
      <WatchlistPanel />
    </AuthGuard>
  );
}
