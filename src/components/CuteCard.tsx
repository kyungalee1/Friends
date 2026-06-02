import { ReactNode } from "react";

interface CuteCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  emoji?: string;
  compact?: boolean;
}

export function CuteCard({ children, className = "", title, emoji, compact = false }: CuteCardProps) {
  return (
    <div className={`card-cute ${className}`}>
      {(title || emoji) && (
        <div className={`flex items-center gap-1.5 ${compact ? "mb-1.5" : "mb-3"}`}>
          {emoji && <span className={compact ? "text-lg" : "text-2xl"}>{emoji}</span>}
          {title && (
            <h2 className={`font-bold text-soft-text ${compact ? "text-sm" : "text-lg"}`}>
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
