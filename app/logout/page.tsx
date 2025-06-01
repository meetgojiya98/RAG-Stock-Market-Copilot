"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Remove the token from localStorage
    localStorage.removeItem("access_token");
    // Redirect to login or homepage
    router.replace("/login");
  }, [router]);

  return <div className="p-12 text-center">Logging out...</div>;
}
