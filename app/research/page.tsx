"use client";
import AuthGuard from "../../components/AuthGuard";
import ResearchPanel from "../../components/ResearchPanel";

export default function ResearchPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <ResearchPanel />
      </div>
    </AuthGuard>
  );
}
