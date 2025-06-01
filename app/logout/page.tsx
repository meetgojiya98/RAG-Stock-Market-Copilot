"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    localStorage.removeItem("access_token");
    router.replace("/login");
  }, [router]);
  return <div className="p-12 text-center">Logging out...</div>;
}
