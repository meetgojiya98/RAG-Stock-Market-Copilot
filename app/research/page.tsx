"use client";
import ResearchPanel from "../../components/ResearchPanel";
import AuthGuard from "../../components/AuthGuard";

export default function ResearchPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <ResearchPanel />
      </div>
    </AuthGuard>
  );
}
