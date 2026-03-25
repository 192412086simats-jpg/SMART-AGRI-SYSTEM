import { Droplets, Thermometer, CloudRain, Zap, Radar, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { MoistureGauge } from "@/components/dashboard/MoistureGauge";
import { ChartSection } from "@/components/dashboard/ChartSection";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";

export default function Index() {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    let isRunning = true;

    const fetchData = async () => {
      while (isRunning) {
        try {
          const res = await fetch("http://localhost:5000/api/data");
          const json = await res.json();

          const formatted = {
            soilMoisture: json.moisture,
            temperature: json.temperature,
            humidity: json.humidity,
            animalDistance: json.distance,
            pumpStatus: json.pump === 1,
            buzzerStatus: json.buzzer === 1,
          };

          setData(formatted);

          setHistory((prev) => [
            ...prev.slice(-30),
            {
              time: new Date().toLocaleTimeString(),
              moisture: json.moisture,
              temperature: json.temperature,
              humidity: json.humidity,
            },
          ]);

        } catch (err) {
          console.log(err);
        }

        // ⚡ VERY FAST (NO DELAY FEEL)
        await new Promise((res) => setTimeout(res, 400));
      }
    };

    fetchData();

    return () => {
      isRunning = false;
    };
  }, []);

  const animalDetected =
    data ? data.animalDistance >= 5 && data.animalDistance <= 50 : false;

  return (
    <div className="min-h-screen h-screen bg-background flex">
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <DashboardHeader isLive={true} />

          {!data ? (
            <p className="text-sm text-muted-foreground mt-12 text-center">
              Loading sensor data…
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SensorCard title="Soil Moisture" icon={<Droplets size={16} />}>
                  <MoistureGauge value={data.soilMoisture} />
                </SensorCard>

                <SensorCard title="Temperature" icon={<Thermometer size={16} />}>
                  <p className="text-2xl font-semibold">{data.temperature}°C</p>
                </SensorCard>

                <SensorCard title="Humidity" icon={<CloudRain size={16} />}>
                  <p className="text-2xl font-semibold">{data.humidity}%</p>
                </SensorCard>

                <SensorCard title="Pump Status" icon={<Zap size={16} />}>
                  <p className={`text-lg font-semibold ${data.pumpStatus ? "text-green-600" : "text-red-600"}`}>
                    {data.pumpStatus ? "Running" : "Stopped"}
                  </p>
                </SensorCard>
              </div>

              {/* Second row */}
              <div className="grid grid-cols-2 gap-4">
                <SensorCard title="Animal Detection" icon={<Radar size={16} />}>
                  <p className={`text-lg font-semibold ${animalDetected ? "text-red-600" : "text-green-600"}`}>
                    {animalDetected ? "YES" : "NO"}
                  </p>
                  <p className="text-xs mt-1">Distance: {data.animalDistance} cm</p>
                </SensorCard>

                <SensorCard title="Buzzer Status" icon={<Volume2 size={16} />}>
                  <p className={`text-lg font-semibold ${data.buzzerStatus ? "text-red-600" : "text-gray-500"}`}>
                    {data.buzzerStatus ? "ON" : "OFF"}
                  </p>
                </SensorCard>
              </div>

              {/* Graph */}
              <ChartSection dailyData={history} />
            </div>
          )}
        </div>
      </div>

      <NotificationPanel data={data} />
    </div>
  );
}