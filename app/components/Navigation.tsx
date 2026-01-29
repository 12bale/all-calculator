"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  TrendingUp,
  Wallet,
  Calendar,
  Shield,
  Cake,
  Heart,
  Laptop,
  Percent,
  DollarSign,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "홈",
    icon: <Calculator className="w-4 h-4" />,
    color: "bg-[var(--primary)]",
    description: "전체 계산기 목록",
  },
  {
    href: "/tier-calculator",
    label: "자산 티어",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "bg-blue-500",
    description: "내 자산 순위 확인",
  },
  {
    href: "/salary-calculator",
    label: "연봉 계산기",
    icon: <Wallet className="w-4 h-4" />,
    color: "bg-green-500",
    description: "실수령액 계산",
  },
  {
    href: "/stack-calculator",
    label: "자산 성장",
    icon: <BarChart3 className="w-4 h-4" />,
    color: "bg-indigo-500",
    description: "복리 시뮬레이션",
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-lg border-b border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-[var(--primary)] rounded-lg">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-[var(--foreground)]">
              전부 계산
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-[var(--secondary)] text-[var(--foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                    }`}
                >
                  <span className={`p-1 rounded ${item.color} text-white`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--foreground)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--foreground)]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 border-t border-[var(--border)] pt-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                      ${
                        isActive
                          ? "bg-[var(--secondary)]"
                          : "hover:bg-[var(--secondary)]"
                      }`}
                  >
                    <span className={`p-2 rounded-lg ${item.color} text-white`}>
                      {item.icon}
                    </span>
                    <div>
                      <p className={`font-medium ${isActive ? "text-[var(--foreground)]" : "text-[var(--foreground)]"}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
