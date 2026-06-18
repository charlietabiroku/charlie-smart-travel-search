"use client";

import { useMemo, useState } from "react";
import { useTravelStore } from "@/lib/store";
import { buildAlertCandidates, formatPrice } from "@/lib/travel";
import { AlertCandidate, NotificationDraft } from "@/lib/types";

export function SettingsPanel() {
  const { routes, prices, alertSettings, updateAlertSettings } = useTravelStore();
  const [form, setForm] = useState({
    enabled: alertSettings.enabled,
    email: alertSettings.email,
    lineId: alertSettings.lineId,
    dropThresholdPercent: alertSettings.dropThresholdPercent,
    notifyBelowTarget: alertSettings.notifyBelowTarget,
    notifyNearLowest: alertSettings.notifyNearLowest
  });
  const [remoteCandidates, setRemoteCandidates] = useState<AlertCandidate[] | null>(null);
  const [draft, setDraft] = useState<NotificationDraft | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [message, setMessage] = useState("");

  const alertCandidates = useMemo(
    () => buildAlertCandidates(routes, prices, { ...alertSettings, ...form, lastUpdatedAt: alertSettings.lastUpdatedAt }),
    [routes, prices, alertSettings, form]
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateAlertSettings(form);
    setMessage("設定を保存しました。");
  }

  async function loadPreviewFromApi() {
    setLoadingPreview(true);
    setMessage("");
    const response = await fetch("/api/alerts/preview");
    const payload = await response.json();
    setRemoteCandidates(payload.candidates ?? []);
    setLoadingPreview(false);
  }

  async function generateDraft(routeId?: string) {
    setLoadingDraft(true);
    setMessage("");
    const response = await fetch("/api/alerts/compose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ routeId })
    });
    const payload = await response.json();
    if (!response.ok) {
      setDraft(null);
      setMessage(payload.message ?? "通知文面を作れませんでした。");
    } else {
      setDraft(payload);
    }
    setLoadingDraft(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={onSubmit} className="rounded-[28px] border border-white bg-white p-6 shadow-card">
        <h3 className="text-lg font-semibold text-ink">通知設定</h3>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          値下がり通知のルールを先に決めておくと、あとでメールやLINE連携を足しやすくなります。
        </p>
        <div className="mt-5 space-y-4">
          <ToggleRow
            label="通知を有効化"
            checked={form.enabled}
            onChange={(checked) => setForm({ ...form, enabled: checked })}
          />
          <ToggleRow
            label="希望価格以下で通知"
            checked={form.notifyBelowTarget}
            onChange={(checked) => setForm({ ...form, notifyBelowTarget: checked })}
          />
          <ToggleRow
            label="過去最安値に近い時に通知"
            checked={form.notifyNearLowest}
            onChange={(checked) => setForm({ ...form, notifyNearLowest: checked })}
          />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">30日平均より何%安ければ通知するか</span>
            <input
              className="input"
              type="number"
              min={1}
              max={50}
              value={form.dropThresholdPercent}
              onChange={(event) => setForm({ ...form, dropThresholdPercent: Number(event.target.value) })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">メールアドレス</span>
            <input
              className="input"
              type="email"
              placeholder="friend@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">LINE ID</span>
            <input
              className="input"
              placeholder="@charlie-alert"
              value={form.lineId}
              onChange={(event) => setForm({ ...form, lineId: event.target.value })}
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          設定を保存
          </button>
          <button
            type="button"
            onClick={() => void loadPreviewFromApi()}
            className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-shell"
          >
            {loadingPreview ? "読込中..." : "APIで候補を確認"}
          </button>
        </div>
        {message ? <p className="mt-3 text-sm text-sky-700">{message}</p> : null}
      </form>

      <div className="rounded-[28px] border border-white bg-white p-6 shadow-card">
        <h3 className="text-lg font-semibold text-ink">通知候補プレビュー</h3>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          現在のルールで通知対象になりそうな路線を先に見られます。
        </p>
        <div className="mt-5 space-y-3">
          {form.enabled && alertCandidates.length ? (
            alertCandidates.map((item) => (
              <div key={item.route.id} className="rounded-2xl bg-shell px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {item.route.origin} → {item.route.destination}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.reasons.join(" / ")}</p>
                  </div>
                  <p className="text-sm font-semibold text-sky-700">
                    {formatPrice(item.lowest.price, item.lowest.currency)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void generateDraft(item.route.id)}
                  className="mt-3 rounded-full bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:bg-mist"
                >
                  この路線の通知文面を作る
                </button>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-shell px-4 py-4 text-sm text-slate-500">
              {form.enabled ? "今の条件では通知候補はありません。" : "通知がオフになっています。"}
            </p>
          )}
        </div>
      </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-ink">API確認結果</h3>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            サーバー側でも同じ通知候補を返せるので、あとからバッチやCronにつなげやすい状態です。
          </p>
          <div className="mt-5 space-y-3">
            {remoteCandidates?.length ? remoteCandidates.map((item) => (
              <div key={`remote-${item.route.id}`} className="rounded-2xl bg-shell px-4 py-4">
                <p className="text-sm font-semibold text-ink">{item.route.origin} → {item.route.destination}</p>
                <p className="mt-1 text-xs text-slate-500">{item.reasons.join(" / ")}</p>
              </div>
            )) : (
              <p className="rounded-2xl bg-shell px-4 py-4 text-sm text-slate-500">
                {loadingPreview ? "通知候補を読み込んでいます。" : "まだ API の確認をしていません。"}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-ink">通知文面ドラフト</h3>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            今は手動送信向けの文面生成です。あとからメール送信やLINE送信にそのままつなげられます。
          </p>
          <div className="mt-5">
            {loadingDraft ? (
              <p className="rounded-2xl bg-shell px-4 py-4 text-sm text-slate-500">通知文面を作成しています。</p>
            ) : draft ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-shell p-4">
                  <p className="text-xs font-semibold text-slate-500">メール件名</p>
                  <p className="mt-2 text-sm font-medium text-ink">{draft.emailSubject}</p>
                </div>
                <div className="rounded-2xl bg-shell p-4">
                  <p className="text-xs font-semibold text-slate-500">メール本文</p>
                  <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{draft.emailBody}</pre>
                </div>
                <div className="rounded-2xl bg-shell p-4">
                  <p className="text-xs font-semibold text-slate-500">LINE本文</p>
                  <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{draft.lineBody}</pre>
                </div>
              </div>
            ) : (
              <p className="rounded-2xl bg-shell px-4 py-4 text-sm text-slate-500">
                通知候補から「通知文面を作る」を押すとここに表示されます。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl bg-shell px-4 py-3">
      <span className="text-sm font-medium text-ink">{label}</span>
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-ink" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </label>
  );
}
