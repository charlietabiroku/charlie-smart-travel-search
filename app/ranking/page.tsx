"use client";

import { SectionTitle } from "@/components/cards";
import { useTravelStore } from "@/lib/store";
import { buildPriceInsight, formatPrice, getDelta } from "@/lib/travel";

export default function RankingPage() {
  const { routes, prices } = useTravelStore();

  const ranking = routes
    .map((route) => {
      const routePrices = prices.filter((price) => price.routeId === route.id);
      const sortedByTime = [...routePrices].sort(
        (a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime()
      );
      const insight = buildPriceInsight(route, routePrices);
      const current = insight.lowest?.price ?? null;
      const previous = sortedByTime[1]?.price ?? null;

      return {
        route,
        insight,
        delta: getDelta(current, previous)
      };
    })
    .filter((item) => item.insight.lowest)
    .sort((a, b) => a.insight.lowest!.price - b.insight.lowest!.price);

  return (
    <div>
      <SectionTitle title="激安ランキング" description="全路線の最安値を安い順に並べ、前回比も見えるようにしています。" />
      <div className="space-y-3">
        {ranking.map((item, index) => (
          <div key={item.route.id} className="grid gap-3 rounded-[28px] border border-white bg-white px-5 py-5 shadow-card lg:grid-cols-[0.35fr_1fr_0.6fr_0.9fr_0.6fr]">
            <div>
              <p className="text-xs text-slate-500">順位</p>
              <p className="mt-1 text-lg font-semibold text-ink">#{index + 1}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">路線</p>
              <p className="mt-1 text-sm font-medium text-ink">{item.route.origin} → {item.route.destination}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">価格</p>
              <p className="mt-1 text-sm font-semibold text-sky-700">
                {item.insight.lowest ? formatPrice(item.insight.lowest.price, item.insight.lowest.currency) : "未登録"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">予約サイト</p>
              <p className="mt-1 text-sm text-ink">{item.insight.lowest?.bookingSite}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">前回比</p>
              <p className={`mt-1 text-sm font-medium ${item.delta !== null && item.delta > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                {item.delta === null ? "比較なし" : item.delta > 0 ? `+${item.delta}` : `${item.delta}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
