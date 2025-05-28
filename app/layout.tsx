import './globals.css'

export const metadata = {
  title: 'RAG Stock Copilot',
  description: 'Your AI-powered Indian stock analyst',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
