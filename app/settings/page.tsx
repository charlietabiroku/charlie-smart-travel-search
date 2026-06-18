import { SectionTitle } from "@/components/cards";
import { SettingsPanel } from "@/components/settings-panel";

const settings = [
  {
    title: "Supabase連携",
    body: "NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定すると、路線と価格を Supabase にも保存できます。"
  },
  {
    title: "通知の土台",
    body: "今はUIだけですが、今後は値下がり検知バッチやメール通知、LINE通知を足しやすい構成です。"
  },
  {
    title: "OpenAI追加設計",
    body: "価格の要約や買い時コメント、共有文面の自動改善は後から OpenAI API を差し込めるように分離しています。"
  }
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="設定" description="今後の拡張に向けた接続ポイントをまとめています。" />
      <SettingsPanel />
      <div className="grid gap-4 lg:grid-cols-3">
        {settings.map((item) => (
          <div key={item.title} className="rounded-[28px] border border-white bg-white p-6 shadow-card">
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-500">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
