"use client";
import AuthGuard from "../../components/AuthGuard";
import NotificationsPanel from "../../components/NotificationsPanel";

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <NotificationsPanel />
      </div>
    </AuthGuard>
  );
}
