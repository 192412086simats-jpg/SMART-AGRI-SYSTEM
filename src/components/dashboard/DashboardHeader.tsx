import { useState, useEffect } from "react";

interface Props {
  isLive: boolean;
}

export function DashboardHeader({ isLive }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-6 border-b border-border">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Smart Agriculture System</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          {" · "}
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full ${isLive ? "bg-success" : "bg-warning"}`}
        />
        <span className="text-xs text-muted-foreground">
          {isLive ? "Live Data Connected" : "Live Mode"}
        </span>
      </div>
    </header>
  );
}
