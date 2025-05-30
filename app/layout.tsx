// // app/layout.tsx
// import "./globals.css";
// import Header from "../components/Header";

// export const metadata = {
//   title: "RAG Stock Copilot",
//   description: "Your Stock Copilot",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="bg-gradient-to-b from-orange-200 to-white dark:from-zinc-900 dark:to-zinc-950 min-h-screen">
//         <Header />
//         <main className="container mx-auto px-4">{children}</main>
//       </body>
//     </html>
//   );
// }

import "./globals.css";
import { Providers } from "./providers";
import Header from "../components/Header";

export const metadata = {
  title: "RAG Stock Copilot",
  description: "Your Stock Copilot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-b from-slate-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 min-h-screen">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
