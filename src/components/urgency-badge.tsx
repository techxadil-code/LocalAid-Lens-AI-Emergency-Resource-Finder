"use client";

import { URGENCY_LEVELS } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface UrgencyBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

export function UrgencyBadge({
  score,
  size = "md",
  pulse,
  className,
}: UrgencyBadgeProps) {
  const level =
    URGENCY_LEVELS[score as keyof typeof URGENCY_LEVELS] || URGENCY_LEVELS[1];
  const shouldPulse = pulse ?? score >= 4;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide uppercase border",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3 py-1.5 text-sm",
        shouldPulse && "animate-pulse",
        className
      )}
      style={{
        color: level.color,
        backgroundColor: `${level.color}15`,
        borderColor: `${level.color}30`,
      }}
    >
      <span
        className="inline-block size-1.5 rounded-full"
        style={{ backgroundColor: level.color }}
      />
      {level.label}
    </span>
  );
}
