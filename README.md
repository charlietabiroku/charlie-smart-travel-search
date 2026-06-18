# Charlie Smart Travel Search

価格最優先の旅行最安値検索MVPです。

## できること

- 路線登録
- 旅行サイトへの検索リンク生成
- 価格入力と履歴保存
- 最安値比較
- 買い時判定
- 日別最安値カレンダー
- 激安ランキング
- 共有テキスト生成

## 使い方

1. 依存関係をインストール
2. `.env.example` を元に環境変数を設定
3. 開発サーバーを起動

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Supabase

- 環境変数未設定でも、ローカル保存でMVPとして使えます
- Supabase を使う場合は `supabase/schema.sql` を実行してテーブルを作成してください

必要な環境変数:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 公開前に変えるもの

- `NEXT_PUBLIC_SITE_URL` を本番ドメインへ変更
- Open Graph 用の共有画像は `app/opengraph-image.tsx` で出し分け
- `robots.txt` と `sitemap.xml` は `NEXT_PUBLIC_SITE_URL` を元に自動生成
