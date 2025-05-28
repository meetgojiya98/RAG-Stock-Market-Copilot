import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "AAPL";
  const API_KEY = process.env.FINNHUB_API_KEY!;
  const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2024-05-01&to=2024-05-31&token=${API_KEY}`;
  const res = await fetch(url);
  const news = await res.json();
  return NextResponse.json({ news });
}
