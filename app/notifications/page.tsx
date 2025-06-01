"use client";
import AuthGuard from "../../components/AuthGuard";
import NotificationsPanel from "../../components/NotificationsPanel";

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <NotificationsPanel />
    </AuthGuard>
  );
}
