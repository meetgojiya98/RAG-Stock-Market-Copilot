import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "AAPL";
  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY!;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${API_KEY}&outputsize=compact`;

  const apiRes = await fetch(url);
  const apiData = await apiRes.json();

  const ts = apiData["Time Series (Daily)"] || {};
  const history = Object.entries(ts)
    .slice(0, 30)
    .reverse()
    .map(([date, v]: [string, any]) => ({
      x: new Date(date).getTime(),
      y: parseFloat(v["4. close"]),
    }));

  return NextResponse.json({ history });
}
