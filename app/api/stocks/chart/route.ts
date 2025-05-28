import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "AAPL";
  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY!;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${API_KEY}&outputsize=compact`;
  const res = await fetch(url);
  const data = await res.json();
  const series = data["Time Series (Daily)"];
  if (!series) return NextResponse.json({ data: [] });
  const chartData = Object.entries(series)
    .slice(0, 30)
    .reverse()
    .map(([date, value]) => ({
      date,
      price: parseFloat((value as any)["4. close"])
    }));
  return NextResponse.json({ data: chartData });
}
