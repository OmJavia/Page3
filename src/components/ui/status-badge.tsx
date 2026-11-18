import { APPOINTMENT_STATUSES } from "@/lib/constants";
import { AppointmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = APPOINTMENT_STATUSES[status];
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      config.color,
      className
    )}>
      {config.label}
    </span>
  );
}
