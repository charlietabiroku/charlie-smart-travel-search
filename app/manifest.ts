import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: "Charlie Smart Travel Search",
    short_name: "Charlie Travel",
    description: "価格最優先で旅行の最安値を追いかける旅行検索サイト。",
    start_url: siteUrl,
    display: "standalone",
    background_color: "#f5f7fb",
    theme_color: "#14213d",
    lang: "ja-JP",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png"
      }
    ]
  };
}
