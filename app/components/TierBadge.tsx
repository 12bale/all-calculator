"use client";

import { TierInfo } from "@/lib/data";
import { Crown, Trophy, Award, Gem, Medal, Star, Shield, Circle, Minus } from "lucide-react";

interface TierBadgeProps {
  tier: TierInfo;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  animated?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Crown,
  Trophy,
  Award,
  Gem,
  Medal,
  Star,
  Shield,
  Circle,
  Minus,
};

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-20 h-20 text-base",
  xl: "w-32 h-32 text-xl",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-10 h-10",
  xl: "w-16 h-16",
};

export default function TierBadge({
  tier,
  size = "md",
  showLabel = true,
  animated = false,
}: TierBadgeProps) {
  const IconComponent = iconMap[tier.icon] || Star;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} ${tier.className} rounded-full flex items-center justify-center
          shadow-lg ${animated ? "animate-pulse-glow" : ""}`}
        style={{
          boxShadow: animated ? `0 0 30px ${tier.color}50` : undefined,
        }}
      >
        <IconComponent
          className={`${iconSizes[size]} ${
            tier.tier === "실버" ? "text-gray-700" : "text-white"
          }`}
        />
      </div>
      {showLabel && (
        <div className="text-center">
          <p
            className={`font-bold ${
              size === "xl" ? "text-2xl" : size === "lg" ? "text-xl" : "text-sm"
            }`}
            style={{ color: tier.color }}
          >
            {tier.tier}
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">{tier.tierEn}</p>
        </div>
      )}
    </div>
  );
}
