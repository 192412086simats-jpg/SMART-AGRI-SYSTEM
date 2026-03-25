interface Props {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function SensorCard({ title, children, icon }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-primary">{icon}</span>}
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}
