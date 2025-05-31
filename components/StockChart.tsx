"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function StockChart({ symbol = "AAPL" }: { symbol?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function fetchAndDraw() {
      const res = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=P9VP18MVWWA1JY7B`
      );
      const data = await res.json();
      const timeSeries = data["Time Series (Daily)"];
      if (!timeSeries) return;

      const labels = Object.keys(timeSeries).slice(0, 15).reverse();
      const prices = labels.map((date) => Number(timeSeries[date]["4. close"]));

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: `${symbol} Price`,
                data: prices,
                fill: false,
                borderColor: "#f59e42",
                tension: 0.1,
              },
            ],
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { x: { display: false } },
          },
        });
      }
    }
    fetchAndDraw();
    // Cleanup for rerender
    return () => {
      if (canvasRef.current) {
        const chart = Chart.getChart(canvasRef.current);
        chart?.destroy();
      }
    };
  }, [symbol]);

  return (
    <div className="mt-4">
      <canvas ref={canvasRef} height={80}></canvas>
    </div>
  );
}
