"use client";

import { RouteForm } from "@/components/forms";
import { RouteCard, SectionTitle } from "@/components/cards";
import { useTravelStore } from "@/lib/store";

export default function RoutesPage() {
  const { routes, prices } = useTravelStore();

  return (
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      <section>
        <SectionTitle title="路線一覧" description="希望価格と最安値を並べて、どこから手をつけるかすぐ決められます。" />
        <div className="grid gap-4">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} prices={prices.filter((price) => price.routeId === route.id)} />
          ))}
        </div>
      </section>
      <section>
        <SectionTitle title="路線登録" description="新しい候補を追加して、価格監視を始めます。" />
        <RouteForm />
      </section>
    </div>
  );
}
