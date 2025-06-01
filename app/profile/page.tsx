"use client";
import AuthGuard from "../../components/AuthGuard";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow text-black dark:text-white">
          Profile info goes here.
        </div>
      </div>
    </AuthGuard>
  );
}
