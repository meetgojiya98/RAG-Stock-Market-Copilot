"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Analytics() {
  const [series, setSeries] = useState([{ name: "Return", data: [5, 10, 6, 12, 9, 18, 11] }]);
  const [labels, setLabels] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

  // You can make this dynamic from your backend if you like
  return (
    <div className="bg-white p-4 border border-navy rounded mt-6 shadow">
      <h4 className="font-bold text-navy mb-2">Portfolio Analytics</h4>
      <ApexChart
        options={{
          chart: { id: "analytics", toolbar: { show: false } },
          xaxis: { categories: labels },
          colors: ["#191970"],
        }}
        series={series}
        type="bar"
        height={180}
      />
    </div>
  );
}
