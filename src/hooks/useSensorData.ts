import { useState, useEffect, useCallback } from "react";
import { SensorData, fetchSensorData, getDemoSensorData, HistoricalDataPoint } from "@/lib/api";

const REFRESH_INTERVAL = 5000;

export function useSensorData() {
  const [data, setData] = useState<SensorData | null>(null);
  const [dailyHistory, setDailyHistory] = useState<HistoricalDataPoint[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetchSensorData();
      setData(result);
      setIsLive(true);
      setError(null);
      // Append to daily history
      setDailyHistory((prev) => {
        const point: HistoricalDataPoint = {
          time: new Date(result.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          moisture: result.soilMoisture,
          temperature: result.temperature,
          humidity: result.humidity,
        };
        const next = [...prev, point];
        return next.length > 50 ? next.slice(-50) : next;
      });
    } catch {
      // Fall back to demo data
      const demo = getDemoSensorData();
      setData(demo);
      setIsLive(false);
      setError("Using demo data — API unavailable");
      setDailyHistory((prev) => {
        const point: HistoricalDataPoint = {
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          moisture: demo.soilMoisture,
          temperature: demo.temperature,
          humidity: demo.humidity,
        };
        const next = [...prev, point];
        return next.length > 50 ? next.slice(-50) : next;
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, dailyHistory, isLive, error };
}
