"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session)
    return (
      <button className="bg-navy text-saffron px-3 py-1 rounded" onClick={() => signIn()}>
        Sign in
      </button>
    );
  return (
    <div className="flex items-center gap-2">
      <span className="text-navy">{session.user?.name || "User"}</span>
      <button className="bg-navy text-saffron px-3 py-1 rounded" onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );
}
