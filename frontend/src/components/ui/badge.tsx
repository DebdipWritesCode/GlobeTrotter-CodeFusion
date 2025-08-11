import React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary";
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const styles =
    variant === "outline"
      ? "border border-current text-current bg-transparent"
      : variant === "secondary"
      ? "bg-muted text-foreground"
      : "bg-primary text-primary-foreground";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", styles, className)}>
      {children}
    </span>
  );
}
