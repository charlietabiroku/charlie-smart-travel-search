import { PriceForm } from "@/components/forms";
import { SectionTitle } from "@/components/cards";

export default async function NewPricePage({
  searchParams
}: {
  searchParams: Promise<{ routeId?: string }>;
}) {
  const params = await searchParams;
  const routeId = params.routeId;

  return (
    <div className="mx-auto max-w-4xl">
      <SectionTitle title="価格入力" description="各サイトで見つけた金額を保存して、最安値と買い時判定に使います。" />
      <PriceForm routeId={routeId} />
    </div>
  );
}
