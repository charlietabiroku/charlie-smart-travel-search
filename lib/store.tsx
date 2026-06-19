"use client";

import { createContext, useContext, useEffect, useState, useTransition } from "react";
import { seedAlertSettings, seedPrices, seedRoutes } from "@/lib/seed";
import { getSupabaseClient } from "@/lib/supabase";
import { AlertSettings, PriceRecord, RouteRecord } from "@/lib/types";

type TravelStoreValue = {
  routes: RouteRecord[];
  prices: PriceRecord[];
  alertSettings: AlertSettings;
  ready: boolean;
  addRoute: (route: Omit<RouteRecord, "id" | "createdAt">) => Promise<void>;
  addPrice: (price: Omit<PriceRecord, "id" | "createdAt">) => Promise<void>;
  updateAlertSettings: (settings: Omit<AlertSettings, "lastUpdatedAt">) => Promise<void>;
};

const TravelStore = createContext<TravelStoreValue | null>(null);

const ROUTES_KEY = "charlie-routes";
const PRICES_KEY = "charlie-prices";
const ALERT_SETTINGS_KEY = "charlie-alert-settings";

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

async function syncSupabase(routes: RouteRecord[], prices: PriceRecord[], alertSettings: AlertSettings) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const routesResult = await supabase.from("routes").upsert(
    routes.map((route) => ({
      id: route.id,
      origin: route.origin,
      destination: route.destination,
      departure_date: route.departureDate,
      return_date: route.returnDate,
      passengers: route.passengers,
      target_price: route.targetPrice,
      memo: route.memo,
      created_at: route.createdAt
    }))
  );
  if (routesResult.error) {
    throw new Error(`Supabase routes sync failed: ${routesResult.error.message}`);
  }

  const pricesResult = await supabase.from("prices").upsert(
    prices.map((price) => ({
      id: price.id,
      route_id: price.routeId,
      price: price.price,
      currency: price.currency,
      airline: price.airline,
      booking_site: price.bookingSite,
      baggage_included: price.baggageIncluded,
      departure_time: price.departureTime,
      arrival_time: price.arrivalTime,
      transfers: price.transfers,
      url: price.url,
      checked_at: price.checkedAt,
      created_at: price.createdAt
    }))
  );
  if (pricesResult.error) {
    throw new Error(`Supabase prices sync failed: ${pricesResult.error.message}`);
  }

  const alertSettingsResult = await supabase.from("alert_settings").upsert({
    id: "default",
    enabled: alertSettings.enabled,
    email: alertSettings.email,
    line_id: alertSettings.lineId,
    drop_threshold_percent: alertSettings.dropThresholdPercent,
    notify_below_target: alertSettings.notifyBelowTarget,
    notify_near_lowest: alertSettings.notifyNearLowest,
    last_updated_at: alertSettings.lastUpdatedAt
  });
  if (alertSettingsResult.error) {
    throw new Error(`Supabase alert settings sync failed: ${alertSettingsResult.error.message}`);
  }
}

function assertRoute(route: Omit<RouteRecord, "id" | "createdAt">) {
  if (!route.origin.trim() || !route.destination.trim()) {
    throw new Error("出発地と目的地を入力してください。");
  }
  if (!route.departureDate || !route.returnDate) {
    throw new Error("出発日と帰国日を入力してください。");
  }
  if (route.passengers < 1) {
    throw new Error("人数は1人以上で入力してください。");
  }
  if (route.targetPrice < 0) {
    throw new Error("希望価格は0以上で入力してください。");
  }
}

function assertPrice(price: Omit<PriceRecord, "id" | "createdAt">) {
  if (!price.routeId) {
    throw new Error("対象の路線を選んでください。");
  }
  if (!price.airline.trim()) {
    throw new Error("航空会社を入力してください。");
  }
  if (!price.departureTime || !price.arrivalTime) {
    throw new Error("出発時間と到着時間を入力してください。");
  }
  if (!price.url.trim()) {
    throw new Error("価格確認元のURLを入力してください。");
  }
  if (!price.checkedAt) {
    throw new Error("確認日時を入力してください。");
  }
}

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

export function TravelStoreProvider({ children }: { children: React.ReactNode }) {
  const [routes, setRoutes] = useState<RouteRecord[]>(seedRoutes);
  const [prices, setPrices] = useState<PriceRecord[]>(seedPrices);
  const [alertSettings, setAlertSettings] = useState<AlertSettings>(seedAlertSettings);
  const [ready, setReady] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    async function hydrate() {
      const storedRoutes = localStorage.getItem(ROUTES_KEY);
      const storedPrices = localStorage.getItem(PRICES_KEY);
      const storedAlertSettings = localStorage.getItem(ALERT_SETTINGS_KEY);

      if (storedRoutes) setRoutes(JSON.parse(storedRoutes));
      if (storedPrices) setPrices(JSON.parse(storedPrices));
      if (storedAlertSettings) setAlertSettings(JSON.parse(storedAlertSettings));

      const supabase = getSupabaseClient();
      if (supabase) {
        const [routesResult, pricesResult] = await Promise.all([
          supabase.from("routes").select("*").order("created_at", { ascending: false }),
          supabase.from("prices").select("*").order("checked_at", { ascending: false })
        ]);
        const alertSettingsResult = await supabase.from("alert_settings").select("*").eq("id", "default").maybeSingle();

        if (!routesResult.error && routesResult.data?.length) {
          setRoutes(routesResult.data.map(mapSupabaseRoute));
        }

        if (!pricesResult.error && pricesResult.data?.length) {
          setPrices(pricesResult.data.map(mapSupabasePrice));
        }

        if (!alertSettingsResult.error && alertSettingsResult.data) {
          setAlertSettings(mapSupabaseAlertSettings(alertSettingsResult.data));
        }
      }

      setReady(true);
    }

    void hydrate();
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
    localStorage.setItem(PRICES_KEY, JSON.stringify(prices));
    localStorage.setItem(ALERT_SETTINGS_KEY, JSON.stringify(alertSettings));
    startTransition(() => {
      void syncSupabase(routes, prices, alertSettings).catch((error) => {
        console.error(error);
      });
    });
  }, [routes, prices, alertSettings, ready]);

  async function addRoute(route: Omit<RouteRecord, "id" | "createdAt">) {
    assertRoute(route);
    const record: RouteRecord = {
      ...route,
      id: makeId("route"),
      createdAt: new Date().toISOString()
    };
    setRoutes((current) => [record, ...current]);
  }

  async function addPrice(price: Omit<PriceRecord, "id" | "createdAt">) {
    assertPrice(price);
    const record: PriceRecord = {
      ...price,
      id: makeId("price"),
      createdAt: new Date().toISOString()
    };
    setPrices((current) => [record, ...current]);
  }

  async function updateAlertSettings(settings: Omit<AlertSettings, "lastUpdatedAt">) {
    setAlertSettings({
      ...settings,
      lastUpdatedAt: new Date().toISOString()
    });
  }

  return (
    <TravelStore.Provider value={{ routes, prices, alertSettings, ready, addRoute, addPrice, updateAlertSettings }}>
      {children}
    </TravelStore.Provider>
  );
}

export function useTravelStore() {
  const value = useContext(TravelStore);
  if (!value) {
    throw new Error("useTravelStore must be used within TravelStoreProvider");
  }
  return value;
}
