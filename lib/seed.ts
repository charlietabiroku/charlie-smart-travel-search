import { AlertSettings, PriceRecord, RouteRecord } from "@/lib/types";

const now = new Date().toISOString();

const routeSeeds: Array<[string, string, string, string, number, number, string]> = [
  ["上海", "福岡", "2026-07-10", "2026-07-15", 1, 1600, "週末弾丸"],
  ["上海", "東京", "2026-07-19", "2026-07-24", 1, 1900, "なるべく深夜便回避"],
  ["上海", "大阪", "2026-08-02", "2026-08-07", 1, 1700, "USJ候補"],
  ["上海", "ソウル", "2026-07-04", "2026-07-07", 1, 1100, "気軽な週末旅行"],
  ["上海", "台北", "2026-08-12", "2026-08-17", 1, 1500, "夜市めぐり"],
  ["上海", "香港", "2026-07-14", "2026-07-17", 1, 1300, "出張ついで"],
  ["上海", "バンコク", "2026-09-05", "2026-09-12", 1, 2200, "荷物あり"],
  ["上海", "チェンマイ", "2026-09-18", "2026-09-25", 1, 2400, "のんびり滞在"]
];

const priceSeeds: Array<[string, number, string, string, string, boolean, string, string, number, string, string]> = [
  ["route-1", 1480, "CNY", "春秋航空", "Trip.com", true, "08:20", "11:15", 0, "https://www.trip.com", "2026-06-11T08:00:00.000Z"],
  ["route-1", 1590, "CNY", "中国東方航空", "Skyscanner", false, "13:40", "17:05", 1, "https://www.skyscanner.net", "2026-06-09T06:30:00.000Z"],
  ["route-1", 1520, "CNY", "春秋航空", "Google Flights", true, "09:15", "12:05", 0, "https://www.google.com/travel/flights", "2026-06-05T06:30:00.000Z"],
  ["route-2", 1880, "CNY", "吉祥航空", "Trip.com", true, "07:50", "12:10", 0, "https://www.trip.com", "2026-06-11T08:30:00.000Z"],
  ["route-2", 2150, "CNY", "中国東方航空", "Expedia", false, "10:35", "15:40", 1, "https://www.expedia.com", "2026-06-02T05:00:00.000Z"],
  ["route-3", 1688, "CNY", "中国国際航空", "Google Flights", true, "06:55", "11:30", 0, "https://www.google.com/travel/flights", "2026-06-10T07:20:00.000Z"],
  ["route-4", 980, "CNY", "済州航空", "Trip.com", false, "11:25", "14:10", 0, "https://www.trip.com", "2026-06-11T07:00:00.000Z"],
  ["route-5", 1420, "CNY", "チャイナエアライン", "Skyscanner", true, "14:40", "17:05", 0, "https://www.skyscanner.net", "2026-06-06T04:40:00.000Z"],
  ["route-6", 1240, "CNY", "香港エクスプレス", "Trip.com", false, "09:35", "12:15", 0, "https://www.trip.com", "2026-06-08T03:15:00.000Z"],
  ["route-7", 2090, "CNY", "タイ・エアアジアX", "Google Flights", true, "16:10", "21:40", 0, "https://www.google.com/travel/flights", "2026-06-11T04:10:00.000Z"],
  ["route-8", 2280, "CNY", "タイ・ライオン・エア", "Expedia", true, "18:35", "00:20", 1, "https://www.expedia.com", "2026-06-07T03:10:00.000Z"]
];

export const seedRoutes: RouteRecord[] = routeSeeds.map(([origin, destination, departureDate, returnDate, passengers, targetPrice, memo], index) => ({
  id: `route-${index + 1}`,
  origin,
  destination,
  departureDate,
  returnDate,
  passengers,
  targetPrice,
  memo,
  createdAt: now
}));

export const seedPrices: PriceRecord[] = priceSeeds.map(([routeId, price, currency, airline, bookingSite, baggageIncluded, departureTime, arrivalTime, transfers, url, checkedAt], index) => ({
  id: `price-${index + 1}`,
  routeId,
  price,
  currency,
  airline,
 bookingSite: bookingSite as PriceRecord["bookingSite"],
  baggageIncluded,
  departureTime,
  arrivalTime,
  transfers,
  url,
  checkedAt,
  createdAt: checkedAt
}));

export const seedAlertSettings: AlertSettings = {
  enabled: true,
  email: "",
  lineId: "",
  dropThresholdPercent: 10,
  notifyBelowTarget: true,
  notifyNearLowest: true,
  lastUpdatedAt: now
};
