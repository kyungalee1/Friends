import { ReactNode } from "react";

interface CuteCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  emoji?: string;
}

export function CuteCard({ children, className = "", title, emoji }: CuteCardProps) {
  return (
    <div className={`card-cute ${className}`}>
      {(title || emoji) && (
        <div className="mb-3 flex items-center gap-2">
          {emoji && <span className="text-2xl">{emoji}</span>}
          {title && <h2 className="text-lg font-bold text-soft-text">{title}</h2>}
        </div>
      )}
      {children}
    </div>
  );
}
