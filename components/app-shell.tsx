"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChartColumnBig, House, Mail, Plane, Settings, ShieldCheck, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "トップ", icon: House },
  { href: "/routes", label: "路線", icon: Plane },
  { href: "/ranking", label: "激安ランキング", icon: ChartColumnBig },
  { href: "/prices/new", label: "価格入力", icon: Ticket },
  { href: "/settings", label: "設定", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-700">Charlie Smart Travel Search</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              高い航空券を買う理由はない。
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-mist px-4 py-3 text-sm font-medium text-sky-700">
            <Bell className="h-4 w-4" />
            値下がり通知の土台まで対応
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-10 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-card backdrop-blur">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold text-sky-700">Charlie Smart Travel Search</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
              価格を記録して、安い便だけをちゃんと拾う旅行サイト。
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              高い航空券を勢いで買わないための、最安値特化ツールです。まずは安全な運用で使えるサイトとして仕上げています。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FooterLink href="/routes" label="路線一覧" />
            <FooterLink href="/ranking" label="激安ランキング" />
            <FooterLink href="/prices/new" label="価格入力" />
            <FooterLink href="/settings" label="通知設定" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-shell px-4 py-3 text-sm text-slate-600">
              <ShieldCheck className="h-4 w-4 text-sky-700" />
              無理なスクレイピングはしない
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-shell px-4 py-3 text-sm text-slate-600">
              <Bell className="h-4 w-4 text-sky-700" />
              値下がり通知の土台あり
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-shell px-4 py-3 text-sm text-slate-600">
              <Mail className="h-4 w-4 text-sky-700" />
              手動送信向け通知ドラフト対応
            </div>
          </div>
        </div>
      </footer>
      <nav className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 items-center justify-between rounded-full border border-white/80 bg-white/90 p-2 shadow-soft backdrop-blur">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-full px-2 py-3 text-xs font-medium transition",
                active ? "bg-ink text-white" : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-2xl bg-shell px-4 py-3 text-sm font-medium text-ink transition hover:bg-mist">
      {label}
    </Link>
  );
}
