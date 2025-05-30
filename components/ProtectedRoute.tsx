"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../api/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  return <>{children}</>;
}
