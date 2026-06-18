"use client";

import Link from "next/link";
import { ArrowRight, Bell, ChartNoAxesCombined, Clock3, Globe2, Plane, ShieldCheck, Sparkles } from "lucide-react";
import { SectionTitle, RouteCard } from "@/components/cards";
import { useTravelStore } from "@/lib/store";
import { buildAlertCandidates, buildPriceInsight, formatPrice, getDelta } from "@/lib/travel";

export default function HomePage() {
  const { routes, prices, alertSettings } = useTravelStore();

  const overview = routes
    .map((route) => {
      const routePrices = prices.filter((price) => price.routeId === route.id);
      const insight = buildPriceInsight(route, routePrices);
      return { route, routePrices, insight };
    })
    .filter((item) => item.insight.lowest)
    .sort((a, b) => a.insight.lowest!.price - b.insight.lowest!.price);

  const cheapest = overview[0];
  const hotDeals = overview.slice(0, 3);
  const alertCandidates = buildAlertCandidates(routes, prices, alertSettings).slice(0, 3);
  const cheapestRouteHistory = cheapest
    ? prices
        .filter((price) => price.routeId === cheapest.route.id)
        .sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime())
    : [];
  const previousLowest = cheapestRouteHistory[1]?.price ?? null;
  const delta = cheapest ? getDelta(cheapest.insight.lowest?.price ?? null, previousLowest) : null;
  const averageTargetPrice = routes.length
    ? Math.round(routes.reduce((sum, route) => sum + route.targetPrice, 0) / routes.length)
    : 0;
  const trackedPriceCount = prices.length;
  const activeDealCount = overview.filter((item) => item.insight.signal !== "様子見").length;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] bg-ink p-7 text-white shadow-soft">
          <p className="text-sm font-medium text-sky-200">最安値特化の旅行検索ツール</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
            AIを後から足せる設計で、まずは最安値を逃さない。
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            検索リンク生成、価格入力、履歴管理、買い時判定、共有テキストまでを一つにまとめた友達向けMVPです。
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <HeroStat label="監視中の路線" value={`${routes.length}本`} />
            <HeroStat label="登録価格" value={`${trackedPriceCount}件`} />
            <HeroStat label="買い候補" value={`${activeDealCount}件`} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/routes" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink">
              路線を見る
            </Link>
            <Link href="/prices/new" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white">
              価格を入力
            </Link>
            <Link href="/settings" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90">
              通知設定
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white bg-white p-6 shadow-card">
            <p className="text-sm font-medium text-slate-500">今日の最安値</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {cheapest?.insight.lowest ? formatPrice(cheapest.insight.lowest.price, cheapest.insight.lowest.currency) : "未登録"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {cheapest ? `${cheapest.route.origin} → ${cheapest.route.destination}` : "価格データを入力すると表示されます"}
            </p>
            <p className="mt-4 text-sm text-sky-700">
              {delta === null ? "前回比較データなし" : delta <= 0 ? `前回比 ${Math.abs(delta)} 安い` : `前回比 ${delta} 高い`}
            </p>
          </div>
          <div className="rounded-[28px] border border-white bg-white p-6 shadow-card">
            <p className="text-sm font-medium text-slate-500">今の買い候補</p>
            <div className="mt-3 space-y-3">
              {hotDeals.map(({ route, insight }) => (
                <div key={route.id} className="flex items-center justify-between rounded-2xl bg-shell px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{route.origin} → {route.destination}</p>
                    <p className="text-xs text-slate-500">{insight.signal}</p>
                  </div>
                  <p className="text-sm font-semibold text-sky-700">
                    {insight.lowest ? formatPrice(insight.lowest.price, insight.lowest.currency) : "未登録"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-white bg-white p-6 shadow-card">
          <SectionTitle title="このサイトでできること" description="最安値特化で、迷わず次の行動に進めるようにしています。" />
          <div className="grid gap-3 sm:grid-cols-2">
            <FeatureCard
              icon={Globe2}
              title="検索リンクを一括生成"
              body="Trip.com、Skyscanner、Google Flights、Expedia を安全に横断します。"
            />
            <FeatureCard
              icon={ChartNoAxesCombined}
              title="価格履歴を蓄積"
              body="見つけた金額を手入力で残して、値動きの感覚をちゃんと持てます。"
            />
            <FeatureCard
              icon={Sparkles}
              title="買い時を自動判定"
              body="希望価格、7日平均、30日平均、過去最安値から今買うべきか判断します。"
            />
            <FeatureCard
              icon={Bell}
              title="通知準備まで完了"
              body="通知候補 API と送信用ドラフトがあるので、次の自動化にすぐ進めます。"
            />
          </div>
        </div>
        <div className="rounded-[32px] border border-white bg-white p-6 shadow-card">
          <SectionTitle title="使い方" description="友達に説明しなくても迷いにくい流れです。" />
          <div className="space-y-4">
            <FlowStep index="01" title="路線を登録" body="上海発の気になる都市を追加して、希望価格を先に決めます。" />
            <FlowStep index="02" title="各サイトで価格確認" body="生成された検索リンクから最安値を見つけて、そのまま保存します。" />
            <FlowStep index="03" title="今買うべきか判断" body="ランキング、カレンダー、通知候補を見て、行くか待つかを決めます。" />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle
          title="通知候補"
          description="今の条件で値下がり通知を飛ばしたくなる路線です。"
          action={<Link href="/settings" className="text-sm font-medium text-sky-700">通知設定</Link>}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {alertCandidates.length ? alertCandidates.map((item) => (
            <div key={item.route.id} className="rounded-[28px] border border-white bg-white p-5 shadow-card">
              <p className="text-sm font-medium text-ink">{item.route.origin} → {item.route.destination}</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-sky-700">
                {formatPrice(item.lowest.price, item.lowest.currency)}
              </p>
              <p className="mt-2 text-sm text-slate-500">{item.reasons.join(" / ")}</p>
            </div>
          )) : (
            <div className="rounded-[28px] border border-white bg-white p-5 text-sm text-slate-500 shadow-card lg:col-span-3">
              通知条件に合う路線はまだありません。
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ManifestCard
          icon={ShieldCheck}
          title="規約を無理に破らない"
          body="最初から危ないスクレイピングに寄せず、手動確認と保存で使える構成にしています。"
        />
        <ManifestCard
          icon={Clock3}
          title="快適性より価格優先"
          body="少し面倒でも安い便を取りにいく。Charlie はその前提で設計しています。"
        />
        <ManifestCard
          icon={Plane}
          title="まずは友達向けMVP"
          body="複雑な旅行管理ツールではなく、すぐ送れてすぐ比較できる軽いサイトを目指しています。"
        />
      </section>

      <section>
        <SectionTitle
          title="注目路線"
          description="初期8路線をそのまま使って、友達がすぐ価格チェックできる構成にしています。"
          action={<Link href="/routes" className="text-sm font-medium text-sky-700">すべて見る</Link>}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {routes.slice(0, 4).map((route) => (
            <RouteCard key={route.id} route={route} prices={prices.filter((price) => price.routeId === route.id)} />
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white bg-white p-6 shadow-card">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-sky-700">Charlie Smart Travel Search</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              旅行に払う金額は、気合いではなく記録で下げる。
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              平均希望価格は {formatPrice(averageTargetPrice, "CNY")}。検索リンク、価格保存、通知候補まで一つにまとまっているので、
              今すぐサイトとして使い始められます。
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/ranking" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
              激安ランキングを見る
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/routes" className="inline-flex items-center gap-2 rounded-full border border-line bg-shell px-5 py-3 text-sm font-semibold text-ink">
              路線を登録する
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-xs text-sky-100">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-shell p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-card">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  );
}

function FlowStep({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-shell p-4">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700 shadow-card">{index}</div>
        <div>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
        </div>
      </div>
    </div>
  );
}

function ManifestCard({
  icon: Icon,
  title,
  body
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[28px] border border-white bg-white p-5 shadow-card">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist text-sky-700">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-500">{body}</p>
    </div>
  );
}
