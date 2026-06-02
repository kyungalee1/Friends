"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "레이스", emoji: "🏁" },
  { href: "/study", label: "공부", emoji: "📚" },
  { href: "/records", label: "기록", emoji: "📊" },
  { href: "/group", label: "그룹", emoji: "👥" },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-pink/20 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 transition-all ${
                active
                  ? "bg-pink/20 text-soft-text scale-105"
                  : "text-soft-muted hover:text-soft-text"
              }`}
            >
              <span className={`text-xl ${active ? "animate-bounce" : ""}`}>
                {item.emoji}
              </span>
              <span className="text-xs font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
