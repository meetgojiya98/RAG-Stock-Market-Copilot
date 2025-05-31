import "./globals.css";
import { Providers } from "../app/providers";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Stock Market Copilot",
  description: "RAG based Stock Market Copilot",
  icons: {
    icon: "/stockmarket.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </Providers>
    </>
  );
}
