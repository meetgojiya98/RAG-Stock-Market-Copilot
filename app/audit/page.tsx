"use client";
import AuthGuard from "../../components/AuthGuard";
import AuditTimeline from "../../components/AuditTimeline";
export default function AuditPage() {
  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6">Full Audit & History</h2>
        <AuditTimeline />
      </div>
    </AuthGuard>
  );
}
