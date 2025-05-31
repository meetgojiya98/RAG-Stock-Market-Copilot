import "./globals.css";
import { ThemeProvider } from "../components/ThemeContext";
import Header from "../components/Header";
import Footer from "../components/Footer"; // Add this

export const metadata = {
  title: "Stock Market Copilot",
  description: "RAG based Stock Market Copilot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="icon" href="/stockmarket.jpg" />
      </head>
      <body className="bg-gradient-to-b from-slate-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 min-h-screen flex flex-col">
      <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer /> {/* Place it here for global bottom alignment */}
          <ThemeProvider>
      </body>
    </html>
  );
}
