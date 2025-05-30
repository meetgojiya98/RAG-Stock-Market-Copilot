// "use client";
// import { useSession } from "next-auth/react";
// import AuthGuard from "../../components/AuthGuard";

// export default function ProfilePage() {
//   const { data: session } = useSession();

//   return (
//     <AuthGuard>
//       <div className="max-w-lg mx-auto p-8 bg-white/80 dark:bg-zinc-900/90 rounded-2xl shadow-xl mt-12">
//         <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
//         <div className="mb-2">
//           <b>Name:</b> {session?.user?.name || "N/A"}
//         </div>
//         <div className="mb-2">
//           <b>Email:</b> {session?.user?.email || "N/A"}
//         </div>
//       </div>
//     </AuthGuard>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import AuthGuard from "../../components/AuthGuard";

export default function ProfilePage() {
  const [user, setUser] = useState<{ email?: string; username?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    fetch("http://localhost:8000/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  return (
    <AuthGuard>
      <div className="max-w-lg mx-auto p-8 bg-white/80 dark:bg-zinc-900/90 rounded-2xl shadow-xl mt-12">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="mb-2">
              <b>Name:</b> {user?.username || "N/A"}
            </div>
            <div className="mb-2">
              <b>Email:</b> {user?.email || "N/A"}
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
