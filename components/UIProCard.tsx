import React from "react";

export default function UIProCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 flex flex-col min-h-[20rem] h-full ${className}`}>
      {children}
    </div>
  );
}
