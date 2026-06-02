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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-pink/15 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 transition-colors ${
                active ? "bg-pink/15 text-soft-text" : "text-soft-muted"
              }`}
            >
              <span className="text-lg leading-none">{item.emoji}</span>
              <span className="text-caption font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
