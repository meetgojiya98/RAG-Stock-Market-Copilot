// components/SessionClientProvider.tsx

"use client";
import React from "react";

export default function SessionClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
