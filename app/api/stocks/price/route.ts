import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "AAPL";
  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY!;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const price = parseFloat(data["Global Quote"]?.["05. price"] ?? "");
  const prevClose = parseFloat(data["Global Quote"]?.["08. previous close"] ?? "");
  const change = prevClose ? ((price - prevClose) / prevClose) * 100 : null;
  return NextResponse.json({ price, change });
}
