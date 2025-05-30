// import "./globals.css";
// import { Providers } from "./providers";
// import Header from "../components/Header";

// export const metadata = {
//   title: "Stock Market Copilot",
//   description: "RAG based Stock Market Copilot",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       {/* Add favicon link in head */}
//       <head>
//         <link rel="icon" href="/stockmarket.jpg" />
//         {/* For PNG, you could use: <link rel="icon" type="image/png" href="/favicon.png" /> */}
//         {/* For SVG, use: <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> */}
//         {/* Only keep the ones you need! */}
//       </head>
//       <body className="bg-gradient-to-b from-slate-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 min-h-screen">
//         <Providers>
//           <Header />
//           {children}
//         </Providers>
//       </body>
//     </html>
//   );
// }

import "./globals.css";
import { Providers } from "./providers";
import Header from "../components/Header";
import Footer from "../components/Footer"; // Add this

export const metadata = {
  title: "Stock Market Copilot",
  description: "RAG based Stock Market Copilot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-b from-slate-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer /> {/* Place it here for global bottom alignment */}
        </Providers>
      </body>
    </html>
  );
}
