import { useState } from "react";
import { SensorData } from "@/lib/api";
import {
  Zap, Radar, Volume2, Droplets, Thermometer, Bell, X,
  CloudRain, Sun, Wind, CloudLightning, AlertTriangle, Leaf,
} from "lucide-react";

interface Props {
  data: SensorData | null;
}

type NotifCategory = "sensor" | "weather" | "system";

interface Notification {
  text: string;
  icon: React.ReactNode;
  type: "warning" | "info" | "success";
  time: string;
  category: NotifCategory;
}

const categoryLabels: Record<NotifCategory, string> = {
  sensor: "Sensor Alerts",
  weather: "Weather Alerts",
  system: "System",
};

export function NotificationPanel({ data }: Props) {
  const [open, setOpen] = useState(false);

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const alerts: Notification[] = [];

  if (data) {
    // Sensor alerts
    if (data.pumpStatus)
      alerts.push({ text: "Pump is currently running", icon: <Zap size={14} />, type: "info", time: now, category: "sensor" });
    if (data.animalDistance >= 5 && data.animalDistance <= 50)
      alerts.push({ text: `Animal detected at ${data.animalDistance} cm`, icon: <Radar size={14} />, type: "warning", time: now, category: "sensor" });
    if (data.buzzerStatus)
      alerts.push({ text: "Buzzer is active", icon: <Volume2 size={14} />, type: "warning", time: now, category: "sensor" });
    if (data.soilMoisture < 30)
      alerts.push({ text: `Soil moisture low (${data.soilMoisture}%)`, icon: <Droplets size={14} />, type: "warning", time: now, category: "sensor" });
    if (data.soilMoisture >= 70)
      alerts.push({ text: `Soil is waterlogged (${data.soilMoisture}%)`, icon: <Droplets size={14} />, type: "warning", time: now, category: "sensor" });
    if (data.temperature > 35)
      alerts.push({ text: `High temperature: ${data.temperature}°C`, icon: <Thermometer size={14} />, type: "warning", time: now, category: "sensor" });
    if (data.temperature < 10)
      alerts.push({ text: `Low temperature: ${data.temperature}°C — frost risk`, icon: <Thermometer size={14} />, type: "warning", time: now, category: "sensor" });
    if (data.humidity > 85)
      alerts.push({ text: `High humidity (${data.humidity}%) — fungal risk`, icon: <CloudRain size={14} />, type: "warning", time: now, category: "sensor" });

    // Weather alerts (simulated based on sensor readings)
    if (data.humidity > 80 && data.temperature > 30)
      alerts.push({ text: "Storm conditions likely", icon: <CloudLightning size={14} />, type: "warning", time: now, category: "weather" });
    if (data.temperature > 38)
      alerts.push({ text: "Heat wave advisory", icon: <Sun size={14} />, type: "warning", time: now, category: "weather" });
    if (data.humidity < 30)
      alerts.push({ text: "Dry wind warning — irrigation recommended", icon: <Wind size={14} />, type: "warning", time: now, category: "weather" });
    if (data.temperature >= 20 && data.temperature <= 30 && data.humidity >= 40 && data.humidity <= 70)
      alerts.push({ text: "Favorable growing conditions", icon: <Leaf size={14} />, type: "success", time: now, category: "weather" });

    // System
    if (!data.pumpStatus && data.soilMoisture < 30)
      alerts.push({ text: "Pump OFF but soil is dry — check system", icon: <AlertTriangle size={14} />, type: "warning", time: now, category: "system" });
  }

  // Group by category
  const grouped = (["sensor", "weather", "system"] as NotifCategory[])
    .map((cat) => ({ cat, items: alerts.filter((a) => a.category === cat) }))
    .filter((g) => g.items.length > 0);

  const typeStyles = {
    warning: "bg-destructive/10 text-destructive",
    info: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
  };

  const panelContent = (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
          {alerts.length > 0 && (
            <span className="ml-1 text-[11px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
              {alerts.length}
            </span>
          )}
        </div>
        <button onClick={() => setOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {grouped.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4">All systems normal — no alerts.</p>
        ) : (
          <div className="space-y-5">
            {grouped.map((g) => (
              <div key={g.cat}>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {categoryLabels[g.cat]}
                </p>
                <ul className="space-y-1">
                  {g.items.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 py-2.5 border-b border-border/60 last:border-0">
                      <span className={`mt-0.5 p-1.5 rounded-md ${typeStyles[a.type]}`}>
                        {a.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-snug">{a.text}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-40 bg-primary text-primary-foreground p-3 rounded-full shadow-md"
        aria-label="Open notifications"
      >
        <Bell size={20} />
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setOpen(false)} />
          <div className="relative w-[340px] max-w-[85vw] bg-card border-l border-border h-full">
            {panelContent}
          </div>
        </div>
      )}

      <aside className="hidden lg:block w-[360px] shrink-0 bg-card border-l border-border h-full">
        {panelContent}
      </aside>
    </>
  );
}
