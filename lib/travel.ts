import { AlertSettings, PriceRecord, RouteRecord, BuySignal, BookingSite } from "@/lib/types";

const currencyMap: Record<string, string> = {
  CNY: "元",
  JPY: "円",
  USD: "$",
  KRW: "ウォン",
  HKD: "HK$",
  TWD: "NT$",
  THB: "฿"
};

export const bookingSites: BookingSite[] = ["Trip.com", "Skyscanner", "Google Flights", "Expedia"];

export function formatPrice(value: number, currency: string) {
  return `${value.toLocaleString("ja-JP")}${currencyMap[currency] ?? ` ${currency}`}`;
}

export function formatRoute(route: RouteRecord) {
  return `${route.origin} → ${route.destination}`;
}

export function getSearchLinks(route: RouteRecord) {
  const passengers = String(route.passengers);
  const trip = `${route.origin} ${route.destination}`;

  return [
    {
      site: "Trip.com",
      href: `https://www.trip.com/flights/showfarefirst?dcity=${encodeURIComponent(route.origin)}&acity=${encodeURIComponent(route.destination)}&ddate=${route.departureDate}&rdate=${route.returnDate}&quantity=${passengers}`
    },
    {
      site: "Skyscanner",
      href: `https://www.skyscanner.net/transport/flights/${encodeURIComponent(route.origin)}/${encodeURIComponent(route.destination)}/${route.departureDate.replaceAll("-", "")}/${route.returnDate.replaceAll("-", "")}/?adultsv2=${passengers}`
    },
    {
      site: "Google Flights",
      href: `https://www.google.com/travel/flights?q=${encodeURIComponent(`${trip} ${route.departureDate} ${route.returnDate}`)}`
    },
    {
      site: "Expedia",
      href: `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${encodeURIComponent(route.origin)},to:${encodeURIComponent(route.destination)},departure:${route.departureDate}TANYT&leg2=from:${encodeURIComponent(route.destination)},to:${encodeURIComponent(route.origin)},departure:${route.returnDate}TANYT&passengers=adults:${passengers}`
    }
  ];
}

export function getPricesForRoute(routeId: string, prices: PriceRecord[]) {
  return prices
    .filter((price) => price.routeId === routeId)
    .sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime());
}

export function getLowestPrice(prices: PriceRecord[]) {
  return [...prices].sort((a, b) => a.price - b.price)[0] ?? null;
}

function averageByDays(prices: PriceRecord[], days: number) {
  const limit = Date.now() - days * 24 * 60 * 60 * 1000;
  const filtered = prices.filter((price) => new Date(price.checkedAt).getTime() >= limit);
  if (!filtered.length) return null;
  return Math.round(filtered.reduce((sum, current) => sum + current.price, 0) / filtered.length);
}

export function buildPriceInsight(route: RouteRecord, prices: PriceRecord[]) {
  const lowest = getLowestPrice(prices);
  const sortedAsc = [...prices].sort((a, b) => a.price - b.price);
  const allTimeLowest = sortedAsc[0] ?? null;
  const avg7 = averageByDays(prices, 7);
  const avg30 = averageByDays(prices, 30);
  const diffFromTarget = lowest ? lowest.price - route.targetPrice : null;

  let signal: BuySignal = "様子見";
  if (lowest) {
    const closeToBest = allTimeLowest && lowest.price <= allTimeLowest.price * 1.03;
    const underTarget = lowest.price <= route.targetPrice;
    const beats30 = avg30 ? lowest.price <= avg30 * 0.9 : false;

    if (underTarget) signal = "今買うべき";
    else if (beats30 || closeToBest) signal = "買い";
    else if (avg30 && lowest.price > avg30) signal = "様子見";
  }

  return {
    lowest,
    avg7,
    avg30,
    allTimeLowest,
    diffFromTarget,
    signal
  };
}

export function buildDailyCalendar(prices: PriceRecord[]) {
  const byDay = new Map<string, PriceRecord>();

  for (const price of prices) {
    const date = price.checkedAt.slice(0, 10);
    const current = byDay.get(date);
    if (!current || price.price < current.price) {
      byDay.set(date, price);
    }
  }

  return [...byDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, price]) => ({ date, ...price }));
}

export function buildShareText(route: RouteRecord, prices: PriceRecord[]) {
  const insight = buildPriceInsight(route, prices);
  if (!insight.lowest) {
    return `${formatRoute(route)}\nまだ価格データがありません`;
  }

  return [
    `${route.origin}→${route.destination}`,
    `最安値：${formatPrice(insight.lowest.price, insight.lowest.currency)}`,
    `予約サイト：${insight.lowest.bookingSite}`,
    `航空会社：${insight.lowest.airline}`,
    `判定：${insight.signal}`
  ].join("\n");
}

export function getSignalTone(signal: BuySignal) {
  if (signal === "今買うべき") return "bg-mint text-emerald-800";
  if (signal === "買い") return "bg-mist text-sky-700";
  return "bg-rose text-rose-700";
}

export function getDelta(current: number | null, previous: number | null) {
  if (current === null || previous === null) return null;
  return current - previous;
}

export function buildAlertCandidates(
  routes: RouteRecord[],
  prices: PriceRecord[],
  settings: AlertSettings
) {
  return routes
    .map((route) => {
      const routePrices = prices.filter((price) => price.routeId === route.id);
      const insight = buildPriceInsight(route, routePrices);
      const lowest = insight.lowest;
      if (!lowest) return null;

      const reasons: string[] = [];
      if (settings.notifyBelowTarget && lowest.price <= route.targetPrice) {
        reasons.push("希望価格以下");
      }
      if (settings.notifyNearLowest && insight.allTimeLowest && lowest.price <= insight.allTimeLowest.price * 1.03) {
        reasons.push("過去最安値に近い");
      }
      if (insight.avg30 && lowest.price <= insight.avg30 * (1 - settings.dropThresholdPercent / 100)) {
        reasons.push(`${settings.dropThresholdPercent}%以上安い`);
      }

      if (!reasons.length) return null;

      return {
        route,
        lowest,
        signal: insight.signal,
        reasons
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.lowest.price - b.lowest.price);
}
