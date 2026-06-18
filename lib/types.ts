export type BookingSite = "Trip.com" | "Skyscanner" | "Google Flights" | "Expedia";

export type RouteRecord = {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  targetPrice: number;
  memo: string;
  createdAt: string;
};

export type PriceRecord = {
  id: string;
  routeId: string;
  price: number;
  currency: string;
  airline: string;
  bookingSite: BookingSite;
  baggageIncluded: boolean;
  departureTime: string;
  arrivalTime: string;
  transfers: number;
  url: string;
  checkedAt: string;
  createdAt: string;
};

export type EnrichedRoute = RouteRecord & {
  prices: PriceRecord[];
};

export type BuySignal = "今買うべき" | "買い" | "様子見";

export type AlertSettings = {
  enabled: boolean;
  email: string;
  lineId: string;
  dropThresholdPercent: number;
  notifyBelowTarget: boolean;
  notifyNearLowest: boolean;
  lastUpdatedAt: string;
};

export type AlertCandidate = {
  route: RouteRecord;
  lowest: PriceRecord;
  signal: BuySignal;
  reasons: string[];
};

export type NotificationDraft = {
  routeId: string;
  emailSubject: string;
  emailBody: string;
  lineBody: string;
  shareText: string;
};
