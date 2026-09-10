// components/SpendingChart.tsx
"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface SpendingChartProps {
  data: Record<string, number>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

export default function SpendingChart({ data }: SpendingChartProps) {
  const chartData = Object.keys(data).map((category) => ({
    name: category,
    value: data[category],
  }));

  const totalSpending = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-sm text-slate-400">
        No expense data available for charts.
      </div>
    );
  }

  return (
    <div className="h-80 w-full relative flex flex-col items-center">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => [`₦${Number(value || 0).toLocaleString()}`, "Amount"]} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Centered Total Amount Overlay */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Spent</p>
          <p className="text-sm font-black text-slate-900">₦{totalSpending.toLocaleString()}</p>
        </div>
      </div>

      {/* Clean Custom Legend List Below Chart */}
      <div className="w-full mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5 px-2">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5 truncate">
            <span 
              className="h-2.5 w-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }} 
            />
            <span className="text-xs font-bold text-slate-700 truncate">
              {entry.name}: <span className="text-slate-900 font-black">₦{entry.value.toLocaleString()}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}