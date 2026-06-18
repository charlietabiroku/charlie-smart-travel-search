import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { TravelStoreProvider } from "@/lib/store";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();
const siteName = "Charlie Smart Travel Search";
const siteDescription = "高い航空券を買う理由はない。価格最優先で旅行の最安値を追いかける旅行検索サイト。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  keywords: [
    "travel",
    "flight deals",
    "cheap flights",
    "Charlie Smart Travel Search",
    "旅行",
    "格安航空券",
    "最安値検索"
  ],
  openGraph: {
    title: siteName,
    description: "AIを後から足せる設計で、まずは最安値を逃さない旅行検索サイト。",
    url: siteUrl,
    siteName,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Charlie Smart Travel Search"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "高い航空券を買う理由はない。価格最優先の旅行最安値検索サイト。",
    images: ["/opengraph-image"]
  },
  alternates: {
    canonical: siteUrl
  },
  applicationName: siteName
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description: siteDescription,
  inLanguage: "ja-JP",
  applicationCategory: "TravelApplication",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/routes`,
    query: "cheap flights"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TravelStoreProvider>
          <AppShell>{children}</AppShell>
        </TravelStoreProvider>
      </body>
    </html>
  );
}
