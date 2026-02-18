import { Hexagon } from "lucide-react";

interface LogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
}

export function Logo({ variant = "default", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 36,
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Hexagon
          size={iconSizes[size]}
          className={variant === "light" ? "text-primary-foreground" : "text-primary"}
          strokeWidth={2.5}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-display font-bold ${
              variant === "light" ? "text-primary-foreground" : "text-primary"
            } ${size === "sm" ? "text-[10px]" : size === "md" ? "text-xs" : "text-sm"}`}
          >
            C
          </span>
        </div>
      </div>
      <span
        className={`font-display font-bold tracking-tight ${sizeClasses[size]} ${
          variant === "light" ? "text-primary-foreground" : "text-foreground"
        }`}
      >
        Cofounderly
      </span>
    </div>
  );
}
