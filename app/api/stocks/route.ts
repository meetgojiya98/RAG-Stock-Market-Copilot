import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "AAPL";
  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY!;
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  const apiRes = await fetch(url);
  const apiData = await apiRes.json();

  const price = parseFloat(
    apiData["Global Quote"]?.["05. price"] || "0"
  );

  return NextResponse.json({ price });
}
