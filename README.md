# craftstack-app

Hono + Bun + Cloudflare D1 のバックエンドに、Vue.js フロントエンドを組み合わせた
モノレポ構成のテンプレート。Cloudflare Workers / Pages へのデプロイを想定。

## 構成

```
craftstack-app/
├── package.json          # Bun Workspaces
├── server/               # Hono + D1 (Cloudflare Workers)
│   ├── src/index.ts
│   ├── db/schema.ts      # Drizzle ORM スキーマ
│   ├── drizzle.config.ts
│   └── wrangler.jsonc
└── client/               # Vue.js + Vite
    ├── src/App.vue
    └── src/lib/hono.ts   # Hono RPC クライアント
```

## 技術スタック

- **ランタイム / パッケージ管理**: Bun (Workspaces)
- **API**: Hono on Cloudflare Workers
- **DB**: Cloudflare D1 + Drizzle ORM
- **フロント**: Vue 3 + Vite + TypeScript
- **型安全な API 通信**: Hono RPC (`hc<AppType>`)

## セットアップ

```bash
# 依存をインストール
bun install

# D1 データベースを作成 (初回のみ)
cd server
bunx wrangler d1 create craftstack-db
# 出力された database_id を server/wrangler.jsonc に貼り付け

# マイグレーションを生成して反映
bun run db:generate
bun run db:migrate:local
```

## 開発

```bash
# 別ターミナルで並列起動
bun run dev:server   # http://localhost:8787
bun run dev:client   # http://localhost:5173
```

## デプロイ

```bash
# サーバ (Workers)
bun run deploy:server

# クライアント (Pages) — wrangler または GitHub 連携で
cd client && bun run build
bunx wrangler pages deploy dist
```
