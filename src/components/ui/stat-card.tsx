import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  className?: string;
  valueClassName?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className, valueClassName }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-bold tracking-tight", valueClassName)}>{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-primary/5 text-primary">
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className={cn("mt-3 text-xs font-medium flex items-center gap-1",
            trend.value >= 0 ? "text-green-600" : "text-red-600"
          )}>
            <span>{trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%</span>
            <span className="text-muted-foreground font-normal">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
