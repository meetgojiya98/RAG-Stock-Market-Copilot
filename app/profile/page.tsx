"use client";
import { useEffect, useState } from "react";
import AuthGuard from "../../components/AuthGuard";

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ email: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-12">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <div className="bg-zinc-900 rounded p-6 text-white">
          {loading && <div>Loading profile...</div>}
          {!loading && profile && (
            <>
              <div>
                <span className="font-semibold">Username:</span> {profile.username}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {profile.email}
              </div>
            </>
          )}
          {!loading && !profile && <div>Profile not found.</div>}
        </div>
      </div>
    </AuthGuard>
  );
}
