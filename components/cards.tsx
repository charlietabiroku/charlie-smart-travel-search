"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BaggageClaim, Calendar, Check, Copy, CornerDownRight, ExternalLink, PlaneTakeoff } from "lucide-react";
import { buildPriceInsight, buildShareText, formatPrice, formatRoute, getSearchLinks, getSignalTone } from "@/lib/travel";
import { PriceRecord, RouteRecord } from "@/lib/types";

export function SectionTitle({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function RouteCard({ route, prices }: { route: RouteRecord; prices: PriceRecord[] }) {
  const insight = buildPriceInsight(route, prices);

  return (
    <Link
      href={`/routes/${route.id}`}
      className="group rounded-[28px] border border-white bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">路線</p>
          <h3 className="mt-1 text-lg font-semibold text-ink">{formatRoute(route)}</h3>
        </div>
        <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:text-sky-600" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoChip icon={Calendar} label="日程" value={`${route.departureDate} - ${route.returnDate}`} />
        <InfoChip icon={PlaneTakeoff} label="人数" value={`${route.passengers}人`} />
        <InfoChip
          icon={CornerDownRight}
          label="希望価格"
          value={formatPrice(route.targetPrice, "CNY")}
        />
        <InfoChip
          icon={BaggageClaim}
          label="最安値"
          value={insight.lowest ? formatPrice(insight.lowest.price, insight.lowest.currency) : "未登録"}
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getSignalTone(insight.signal)}`}>
          {insight.signal}
        </span>
        <span className="text-sm text-slate-500">{route.memo || "メモなし"}</span>
      </div>
    </Link>
  );
}

function InfoChip({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-shell px-4 py-3">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

export function PriceSummary({ route, prices }: { route: RouteRecord; prices: PriceRecord[] }) {
  const insight = buildPriceInsight(route, prices);
  const shareText = buildShareText(route, prices);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="rounded-[28px] border border-white bg-white p-6 shadow-card">
        <p className="text-sm font-medium text-sky-700">最安値</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <h3 className="text-4xl font-semibold tracking-tight text-ink">
            {insight.lowest ? formatPrice(insight.lowest.price, insight.lowest.currency) : "未登録"}
          </h3>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getSignalTone(insight.signal)}`}>
            {insight.signal}
          </span>
        </div>
        {insight.lowest ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoChip icon={PlaneTakeoff} label="航空会社" value={insight.lowest.airline} />
            <InfoChip icon={ExternalLink} label="予約サイト" value={insight.lowest.bookingSite} />
            <InfoChip icon={CornerDownRight} label="乗継回数" value={`${insight.lowest.transfers}回`} />
            <InfoChip
              icon={BaggageClaim}
              label="手荷物"
              value={insight.lowest.baggageIncluded ? "込み" : "別料金"}
            />
          </div>
        ) : null}
      </div>
      <div className="rounded-[28px] border border-white bg-white p-6 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-500">共有テキスト</p>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full bg-shell px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-mist"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "コピー済み" : "コピー"}
          </button>
        </div>
        <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-shell p-4 text-sm leading-6 text-ink">
          {shareText}
        </pre>
      </div>
    </div>
  );
}

export function SearchLinkCards({ route }: { route: RouteRecord }) {
  const links = getSearchLinks(route);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {links.map((link) => (
        <a
          key={link.site}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-[24px] border border-white bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
        >
          <p className="text-sm text-slate-500">{link.site}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-semibold text-ink">検索ページへ</span>
            <ExternalLink className="h-4 w-4 text-sky-600" />
          </div>
        </a>
      ))}
    </div>
  );
}
