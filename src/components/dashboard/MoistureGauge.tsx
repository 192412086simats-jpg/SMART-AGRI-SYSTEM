interface Props {
  value: number;
}

function getLabel(v: number) {
  if (v < 30) return { text: "Dry", color: "text-destructive" };
  if (v < 70) return { text: "Normal", color: "text-success" };
  return { text: "Wet", color: "text-primary" };
}

export function MoistureGauge({ value }: Props) {
  const label = getLabel(value);
  // Simple horizontal bar gauge
  return (
    <div>
      <p className="text-2xl font-semibold text-foreground tabular-nums">{value}%</p>
      <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <p className={`text-xs mt-1.5 font-medium ${label.color}`}>{label.text}</p>
    </div>
  );
}
