"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { bookingSites } from "@/lib/travel";
import { useTravelStore } from "@/lib/store";

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString().slice(0, 10);
}

export function RouteForm() {
  const router = useRouter();
  const { addRoute } = useTravelStore();
  const [error, setError] = useState("");
  const defaultDeparture = addDays(new Date(), 30);
  const defaultReturn = addDays(new Date(), 35);
  const [form, setForm] = useState({
    origin: "上海",
    destination: "福岡",
    departureDate: defaultDeparture,
    returnDate: defaultReturn,
    passengers: 1,
    targetPrice: 1500,
    memo: ""
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await addRoute(form);
      router.push("/routes");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "路線の保存に失敗しました。");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[28px] border border-white bg-white p-6 shadow-card">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="出発地">
          <input className="input" value={form.origin} onChange={(event) => setForm({ ...form, origin: event.target.value })} />
        </Field>
        <Field label="目的地">
          <input className="input" value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} />
        </Field>
        <Field label="出発日">
          <input className="input" type="date" value={form.departureDate} onChange={(event) => setForm({ ...form, departureDate: event.target.value })} required />
        </Field>
        <Field label="帰国日">
          <input className="input" type="date" value={form.returnDate} onChange={(event) => setForm({ ...form, returnDate: event.target.value })} required />
        </Field>
        <Field label="人数">
          <input className="input" type="number" min={1} value={form.passengers} onChange={(event) => setForm({ ...form, passengers: Number(event.target.value) })} required />
        </Field>
        <Field label="希望価格">
          <input className="input" type="number" min={0} value={form.targetPrice} onChange={(event) => setForm({ ...form, targetPrice: Number(event.target.value) })} required />
        </Field>
      </div>
      <Field label="メモ" className="mt-4">
        <textarea className="input min-h-28" value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} />
      </Field>
      {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}
      <button className="mt-6 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        路線を追加
      </button>
    </form>
  );
}

export function PriceForm({ routeId }: { routeId?: string }) {
  const router = useRouter();
  const { routes, addPrice } = useTravelStore();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    routeId: routeId || routes[0]?.id || "",
    price: 1480,
    currency: "CNY",
    airline: "",
    bookingSite: bookingSites[0],
    baggageIncluded: true,
    departureTime: "08:30",
    arrivalTime: "11:40",
    transfers: 0,
    url: "",
    checkedAt: new Date().toISOString().slice(0, 16)
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      await addPrice({
        ...form,
        checkedAt: new Date(form.checkedAt).toISOString()
      });
      router.push(form.routeId ? `/routes/${form.routeId}` : "/routes");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "価格の保存に失敗しました。");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[28px] border border-white bg-white p-6 shadow-card">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="路線">
          <select className="input" value={form.routeId} onChange={(event) => setForm({ ...form, routeId: event.target.value })}>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.origin} → {route.destination}
              </option>
            ))}
          </select>
        </Field>
        <Field label="価格">
          <input className="input" type="number" min={0} value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} required />
        </Field>
        <Field label="通貨">
          <input className="input" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value.toUpperCase() })} required />
        </Field>
        <Field label="航空会社">
          <input className="input" value={form.airline} onChange={(event) => setForm({ ...form, airline: event.target.value })} required />
        </Field>
        <Field label="予約サイト">
          <select className="input" value={form.bookingSite} onChange={(event) => setForm({ ...form, bookingSite: event.target.value as typeof form.bookingSite })}>
            {bookingSites.map((site) => (
              <option key={site} value={site}>
                {site}
              </option>
            ))}
          </select>
        </Field>
        <Field label="手荷物">
          <select className="input" value={form.baggageIncluded ? "yes" : "no"} onChange={(event) => setForm({ ...form, baggageIncluded: event.target.value === "yes" })}>
            <option value="yes">込み</option>
            <option value="no">別料金</option>
          </select>
        </Field>
        <Field label="出発時間">
          <input className="input" type="time" value={form.departureTime} onChange={(event) => setForm({ ...form, departureTime: event.target.value })} required />
        </Field>
        <Field label="到着時間">
          <input className="input" type="time" value={form.arrivalTime} onChange={(event) => setForm({ ...form, arrivalTime: event.target.value })} required />
        </Field>
        <Field label="乗継回数">
          <input className="input" type="number" min={0} value={form.transfers} onChange={(event) => setForm({ ...form, transfers: Number(event.target.value) })} required />
        </Field>
        <Field label="確認日時">
          <input className="input" type="datetime-local" value={form.checkedAt} onChange={(event) => setForm({ ...form, checkedAt: event.target.value })} required />
        </Field>
      </div>
      <Field label="URL" className="mt-4">
        <input className="input" type="url" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} required />
      </Field>
      {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}
      <button className="mt-6 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        価格を保存
      </button>
    </form>
  );
}

function Field({
  label,
  children,
  className = ""
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
