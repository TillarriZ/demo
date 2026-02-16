"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoVista from "./LogoVista";
import ProfileModal from "./ProfileModal";

const topNavItems: { href: string; label: string }[] = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/wiki", label: "Human Factor Wiki" },
];

function IconUser() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="bg-[var(--header)] text-white sticky top-0 z-50 shadow-md">
        <div className="flex items-center h-14 px-4 gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0 min-h-[44px]">
            <LogoVista className="w-8 h-8 text-white" />
            <span className="font-semibold text-sm whitespace-nowrap">Vista AI-Human Factor</span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto min-w-0" aria-label="Основная навигация">
            {topNavItems.map(({ href, label }) => {
              const isActive = pathname === href || (href !== "/products" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded text-sm whitespace-nowrap transition-colors min-h-[44px] flex items-center ${
                    isActive ? "bg-[var(--header-active)]" : "hover:bg-[var(--header-hover)]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="ml-auto flex items-center gap-2 px-2 py-2 rounded min-h-[44px] min-w-[44px] hover:bg-[var(--header-hover)] transition-colors"
            aria-label="Открыть профиль"
          >
            <IconUser />
            <span className="text-sm font-medium hidden sm:inline">Профиль</span>
          </button>
        </div>
      </header>
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </>
  );
}
