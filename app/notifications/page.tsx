"use client";
import NotificationsPanel from "../../components/NotificationsPanel";
import AuthGuard from "../../components/AuthGuard";

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <NotificationsPanel />
      </div>
    </AuthGuard>
  );
}
