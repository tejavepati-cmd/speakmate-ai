"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sparkles, Sun, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { allNavItems, bottomNavItems, navGroups, titleForPath } from "@/lib/navigation";
import { useAppData, updateSettings } from "@/lib/storage/store";
import { useAppContext } from "@/components/providers/AppProviders";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ThemeToggle() {
  const { settings } = useAppData();
  const isDark = settings.theme === "dark";
  return (
    <button
      type="button"
      onClick={() => updateSettings({ theme: isDark ? "light" : "dark" })}
      className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      {isDark ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
    </button>
  );
}

function OnlineBadge() {
  const { online } = useAppContext();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide",
        online ? "bg-success-soft text-success" : "bg-surface-muted text-muted",
      )}
      title={online ? "Online AI features available" : "Offline mode — local practice only"}
    >
      {online ? <Wifi className="size-3" aria-hidden="true" /> : <WifiOff className="size-3" aria-hidden="true" />}
      <span className="hidden sm:inline">{online ? "Online" : "Offline"}</span>
    </span>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="SpeakMate AI home">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-pink text-white shadow-md">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="text-base font-extrabold leading-none tracking-tight">
          SpeakMate<span className="text-primary"> AI</span>
        </span>
      )}
    </Link>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface/85 px-3 py-5 backdrop-blur-xl lg:flex">
      <div className="px-3 pb-6">
        <Brand />
        <p className="mt-1.5 pl-11 text-[0.68rem] font-medium text-muted">Think in your language.</p>
      </div>
      <nav aria-label="Primary" className="flex-1 space-y-5 overflow-y-auto pb-4">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">{group.title}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                        active
                          ? item.accent === "pink"
                            ? "bg-pink-soft text-pink"
                            : "bg-primary-soft text-primary dark:text-foreground"
                          : "text-muted hover:bg-surface-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-[1.15rem] shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="rounded-2xl bg-gradient-to-br from-primary-soft to-pink-soft p-4">
        <p className="text-sm font-bold">Small steps, real progress.</p>
        <p className="mt-1 text-xs text-muted">Practise a little every day and watch your confidence grow.</p>
      </div>
    </aside>
  );
}

function MobileMoreSheet() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="flex min-w-0 flex-1 flex-col items-center gap-1 py-1 text-muted" aria-label="Open more pages">
          <Menu className="size-5" aria-hidden="true" />
          <span className="text-[0.65rem] font-semibold">More</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[80dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Explore SpeakMate</DialogTitle>
          <DialogDescription>Every tool, right at your fingertips.</DialogDescription>
        </DialogHeader>
        <nav aria-label="All pages" className="space-y-1">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 hover:bg-surface-muted"
              >
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <span className="flex-1">
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span className="block text-xs text-muted">{item.description}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      </DialogContent>
    </Dialog>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface/95 px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-xl lg:hidden"
    >
      {bottomNavItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[0.65rem] font-semibold",
              active ? "text-primary" : "text-muted",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="truncate">{item.label.split(" ")[0]}</span>
          </Link>
        );
      })}
      <MobileMoreSheet />
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") return <>{children}</>;

  return (
    <div className="min-h-dvh">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Sidebar pathname={pathname} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl md:px-6">
          <div className="lg:hidden"><Brand compact /></div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-extrabold tracking-tight md:text-lg">{titleForPath(pathname)}</h1>
          </div>
          <div className="hidden sm:block"><OnlineBadge /></div>
          <ThemeToggle />
          <Link
            href="/settings"
            className="hidden size-11 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:text-foreground sm:inline-flex"
            aria-label="Open settings"
          >
            <Sparkles className="size-5" aria-hidden="true" />
          </Link>
        </header>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:px-6 md:pb-16 md:pt-8">
          {children}
        </main>
        <footer className="hidden px-6 pb-8 text-center text-xs text-muted lg:block">
          SpeakMate AI · Think in Your Language. Communicate with Confidence.
        </footer>
      </div>
      <BottomNav pathname={pathname} />
    </div>
  );
}

export { OnlineBadge, ThemeToggle, Brand };
