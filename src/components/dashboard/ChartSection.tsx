import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { HistoricalDataPoint, getWeeklyData, getMonthlyData } from "@/lib/api";

interface Props {
  dailyData: HistoricalDataPoint[];
}

const tabs = ["Daily", "Weekly", "Monthly"] as const;

export function ChartSection({ dailyData }: Props) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Daily");

  const weeklyData = useMemo(() => getWeeklyData(), []);
  const monthlyData = useMemo(() => getMonthlyData(), []);

  const chartData = active === "Daily" ? dailyData : active === "Weekly" ? weeklyData : monthlyData;

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center gap-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              active === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab}
            {tab === "Daily" && (
              <span className="ml-1 text-[10px] opacity-75">LIVE</span>
            )}
          </button>
        ))}
      </div>

      {chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(80 10% 88%)" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(150 5% 45%)" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(150 5% 45%)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 100%)",
                border: "1px solid hsl(80 10% 88%)",
                borderRadius: 6,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="moisture"
              stroke="hsl(82 45% 35%)"
              strokeWidth={2}
              dot={false}
              name="Moisture %"
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="hsl(24 80% 50%)"
              strokeWidth={2}
              dot={false}
              name="Temp °C"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="hsl(200 60% 45%)"
              strokeWidth={2}
              dot={false}
              name="Humidity %"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
