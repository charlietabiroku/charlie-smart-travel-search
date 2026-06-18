import { seedAlertSettings, seedPrices, seedRoutes } from "@/lib/seed";
import { getSupabaseClient } from "@/lib/supabase";
import { buildAlertCandidates, buildPriceInsight, buildShareText, formatPrice } from "@/lib/travel";
import { AlertCandidate, AlertSettings, NotificationDraft, PriceRecord, RouteRecord } from "@/lib/types";

function mapSupabaseRoute(route: {
  id: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  passengers: number;
  target_price: number;
  memo: string | null;
  created_at: string;
}): RouteRecord {
  return {
    id: route.id,
    origin: route.origin,
    destination: route.destination,
    departureDate: route.departure_date,
    returnDate: route.return_date,
    passengers: route.passengers,
    targetPrice: Number(route.target_price),
    memo: route.memo ?? "",
    createdAt: route.created_at
  };
}

function mapSupabasePrice(price: {
  id: string;
  route_id: string;
  price: number;
  currency: string;
  airline: string;
  booking_site: PriceRecord["bookingSite"];
  baggage_included: boolean;
  departure_time: string;
  arrival_time: string;
  transfers: number;
  url: string;
  checked_at: string;
  created_at: string;
}): PriceRecord {
  return {
    id: price.id,
    routeId: price.route_id,
    price: Number(price.price),
    currency: price.currency,
    airline: price.airline,
    bookingSite: price.booking_site,
    baggageIncluded: price.baggage_included,
    departureTime: price.departure_time,
    arrivalTime: price.arrival_time,
    transfers: price.transfers,
    url: price.url,
    checkedAt: price.checked_at,
    createdAt: price.created_at
  };
}

function mapSupabaseAlertSettings(settings: {
  enabled: boolean;
  email: string;
  line_id: string;
  drop_threshold_percent: number;
  notify_below_target: boolean;
  notify_near_lowest: boolean;
  last_updated_at: string;
}): AlertSettings {
  return {
    enabled: settings.enabled,
    email: settings.email,
    lineId: settings.line_id,
    dropThresholdPercent: settings.drop_threshold_percent,
    notifyBelowTarget: settings.notify_below_target,
    notifyNearLowest: settings.notify_near_lowest,
    lastUpdatedAt: settings.last_updated_at
  };
}

export async function loadTravelDataForAlerts() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      routes: seedRoutes,
      prices: seedPrices,
      alertSettings: seedAlertSettings
    };
  }

  const [routesResult, pricesResult, settingsResult] = await Promise.all([
    supabase.from("routes").select("*").order("created_at", { ascending: false }),
    supabase.from("prices").select("*").order("checked_at", { ascending: false }),
    supabase.from("alert_settings").select("*").eq("id", "default").maybeSingle()
  ]);

  return {
    routes: routesResult.data?.length ? routesResult.data.map(mapSupabaseRoute) : seedRoutes,
    prices: pricesResult.data?.length ? pricesResult.data.map(mapSupabasePrice) : seedPrices,
    alertSettings: settingsResult.data ? mapSupabaseAlertSettings(settingsResult.data) : seedAlertSettings
  };
}

export async function getAlertPreview() {
  const { routes, prices, alertSettings } = await loadTravelDataForAlerts();
  const candidates = alertSettings.enabled ? buildAlertCandidates(routes, prices, alertSettings) : [];

  return {
    alertSettings,
    totalCandidates: candidates.length,
    candidates
  };
}

export async function buildNotificationDraft(routeId?: string): Promise<NotificationDraft | null> {
  const { routes, prices, alertSettings } = await loadTravelDataForAlerts();
  const candidates = alertSettings.enabled ? buildAlertCandidates(routes, prices, alertSettings) : [];
  const candidate = routeId
    ? candidates.find((item) => item.route.id === routeId)
    : candidates[0];

  if (!candidate) return null;

  const routePrices = prices.filter((price) => price.routeId === candidate.route.id);
  const insight = buildPriceInsight(candidate.route, routePrices);
  const shareText = buildShareText(candidate.route, routePrices);
  const reasonLine = candidate.reasons.join(" / ");
  const lowestText = formatPrice(candidate.lowest.price, candidate.lowest.currency);
  const emailSubject = `Charlie Alert: ${candidate.route.origin}→${candidate.route.destination} が ${lowestText}`;

  const emailBody = [
    `${candidate.route.origin} → ${candidate.route.destination}`,
    ``,
    `最安値: ${lowestText}`,
    `予約サイト: ${candidate.lowest.bookingSite}`,
    `航空会社: ${candidate.lowest.airline}`,
    `判定: ${insight.signal}`,
    `通知理由: ${reasonLine}`,
    `確認日時: ${new Date(candidate.lowest.checkedAt).toLocaleString("ja-JP")}`,
    ``,
    `検索URL: ${candidate.lowest.url}`,
    ``,
    shareText
  ].join("\n");

  const lineBody = [
    `Charlie Alert`,
    `${candidate.route.origin}→${candidate.route.destination}`,
    `最安値 ${lowestText}`,
    `${candidate.lowest.bookingSite} / ${candidate.lowest.airline}`,
    `理由: ${reasonLine}`,
    `判定: ${insight.signal}`,
    candidate.lowest.url
  ].join("\n");

  return {
    routeId: candidate.route.id,
    emailSubject,
    emailBody,
    lineBody,
    shareText
  };
}
