// Configure your API endpoint here
const API_BASE_URL = "/api";

export interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  pumpStatus: boolean;
  animalDistance: number;
  buzzerStatus: boolean;
  timestamp: string;
}

export interface HistoricalDataPoint {
  time: string;
  moisture: number;
  temperature: number;
  humidity: number;
}

// Fetch live sensor data from API
export async function fetchSensorData(): Promise<SensorData> {
  const res = await fetch(`${API_BASE_URL}/sensor-data`);
  if (!res.ok) throw new Error("Failed to fetch sensor data");
  return res.json();
}

// Fetch daily historical data from API
export async function fetchDailyData(): Promise<HistoricalDataPoint[]> {
  const res = await fetch(`${API_BASE_URL}/sensor-data/daily`);
  if (!res.ok) throw new Error("Failed to fetch daily data");
  return res.json();
}

// Demo fallback data for when API is unavailable
export function getDemoSensorData(): SensorData {
  return {
    soilMoisture: 42 + Math.round(Math.random() * 10),
    temperature: 28 + Math.round(Math.random() * 4),
    humidity: 65 + Math.round(Math.random() * 8),
    pumpStatus: Math.random() > 0.5,
    animalDistance: Math.random() > 0.7 ? 15 + Math.round(Math.random() * 30) : 120 + Math.round(Math.random() * 80),
    buzzerStatus: false,
    timestamp: new Date().toISOString(),
  };
}

export function getWeeklyData(): HistoricalDataPoint[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d) => ({
    time: d,
    moisture: 35 + Math.round(Math.random() * 25),
    temperature: 26 + Math.round(Math.random() * 6),
    humidity: 58 + Math.round(Math.random() * 15),
  }));
}

export function getMonthlyData(): HistoricalDataPoint[] {
  return Array.from({ length: 4 }, (_, i) => ({
    time: `Week ${i + 1}`,
    moisture: 38 + Math.round(Math.random() * 20),
    temperature: 27 + Math.round(Math.random() * 5),
    humidity: 60 + Math.round(Math.random() * 12),
  }));
}
