"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SectionTitle, SearchLinkCards, PriceSummary } from "@/components/cards";
import { useTravelStore } from "@/lib/store";
import { buildDailyCalendar, buildPriceInsight, formatPrice } from "@/lib/travel";

export default function RouteDetailPage() {
  const params = useParams<{ id: string }>();
  const { routes, prices } = useTravelStore();
  const route = routes.find((item) => item.id === params.id);

  if (!route) {
    return (
      <div className="rounded-[28px] border border-white bg-white p-8 text-center shadow-card">
        <h2 className="text-2xl font-semibold text-ink">路線が見つかりません</h2>
        <p className="mt-3 text-sm text-slate-500">一覧に戻って、登録済みの路線を選んでください。</p>
        <Link href="/routes" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
          路線一覧へ戻る
        </Link>
      </div>
    );
  }

  const routePrices = prices.filter((price) => price.routeId === route.id);
  const insight = buildPriceInsight(route, routePrices);
  const calendar = buildDailyCalendar(routePrices);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-slate-500">路線詳細</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              {route.origin} → {route.destination}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {route.departureDate} - {route.returnDate} / {route.passengers}人 / 希望価格 {formatPrice(route.targetPrice, "CNY")}
            </p>
          </div>
          <Link href={`/prices/new?routeId=${route.id}`} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
            この路線の価格を入力
          </Link>
        </div>
      </section>

      <PriceSummary route={route} prices={routePrices} />

      <section>
        <SectionTitle title="検索リンク" description="自動取得はまだ使わず、安全に各サイトの検索画面へ飛ばします。" />
        <SearchLinkCards route={route} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white bg-white p-6 shadow-card">
          <SectionTitle title="買い時判定" />
          <div className="grid gap-3">
            <InsightRow label="現在最安値" value={insight.lowest ? formatPrice(insight.lowest.price, insight.lowest.currency) : "未登録"} />
            <InsightRow label="過去7日平均" value={insight.avg7 ? formatPrice(insight.avg7, "CNY") : "データ不足"} />
            <InsightRow label="過去30日平均" value={insight.avg30 ? formatPrice(insight.avg30, "CNY") : "データ不足"} />
            <InsightRow label="過去最安値" value={insight.allTimeLowest ? formatPrice(insight.allTimeLowest.price, insight.allTimeLowest.currency) : "未登録"} />
            <InsightRow label="希望価格との差額" value={insight.diffFromTarget === null ? "未登録" : `${insight.diffFromTarget > 0 ? "+" : ""}${formatPrice(insight.diffFromTarget, "CNY")}`} />
            <InsightRow label="判定" value={insight.signal} emphasize />
          </div>
        </div>
        <div className="rounded-[28px] border border-white bg-white p-6 shadow-card">
          <SectionTitle title="最安値カレンダー" description="日付ごとの最安値だけを一覧化。" />
          <div className="space-y-3">
            {calendar.length ? calendar.map((item) => (
              <div key={`${item.id}-${item.date}`} className="grid grid-cols-[0.95fr_0.7fr_0.8fr_0.9fr] gap-2 rounded-2xl bg-shell px-4 py-3 text-sm">
                <span className="font-medium text-ink">{item.date}</span>
                <span className="text-sky-700">{formatPrice(item.price, item.currency)}</span>
                <span className="text-slate-600">{item.bookingSite}</span>
                <span className="truncate text-slate-600">{item.airline}</span>
              </div>
            )) : <p className="text-sm text-slate-500">まだ価格データがありません。</p>}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white bg-white p-6 shadow-card">
        <SectionTitle title="価格履歴" description="新しい順に見ながら、どのサイトが安いか比べられます。" />
        <div className="space-y-3">
          {routePrices.length ? routePrices.map((price) => (
            <a key={price.id} href={price.url} target="_blank" rel="noreferrer" className="grid gap-3 rounded-2xl bg-shell px-4 py-4 lg:grid-cols-[0.9fr_0.9fr_0.8fr_0.7fr_1.1fr_0.8fr]">
              <div>
                <p className="text-xs text-slate-500">価格</p>
                <p className="mt-1 text-sm font-semibold text-ink">{formatPrice(price.price, price.currency)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">サイト</p>
                <p className="mt-1 text-sm text-ink">{price.bookingSite}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">航空会社</p>
                <p className="mt-1 text-sm text-ink">{price.airline}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">乗継</p>
                <p className="mt-1 text-sm text-ink">{price.transfers}回</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">時間</p>
                <p className="mt-1 text-sm text-ink">{price.departureTime} - {price.arrivalTime}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">確認日時</p>
                <p className="mt-1 text-sm text-ink">{new Date(price.checkedAt).toLocaleString("ja-JP")}</p>
              </div>
            </a>
          )) : <p className="text-sm text-slate-500">まだ価格が入力されていません。</p>}
        </div>
      </section>
    </div>
  );
}

function InsightRow({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-shell px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={emphasize ? "text-sm font-semibold text-sky-700" : "text-sm font-medium text-ink"}>{value}</span>
    </div>
  );
}
