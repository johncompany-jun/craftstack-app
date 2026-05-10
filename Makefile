.PHONY: install dev dev-server dev-client build deploy typecheck \
        db-generate db-migrate-local db-migrate-remote clean help

help:
	@echo "make install            - 依存をインストール"
	@echo "make dev                - server (8787) と client (5173) を同時起動"
	@echo "make dev-server         - server だけ起動"
	@echo "make dev-client         - client だけ起動"
	@echo "make build              - client をビルド"
	@echo "make deploy             - server を Cloudflare Workers にデプロイ"
	@echo "make typecheck          - 全ワークスペースの型チェック"
	@echo "make db-generate        - Drizzle マイグレーション生成"
	@echo "make db-migrate-local   - ローカル D1 にマイグレーション適用"
	@echo "make db-migrate-remote  - リモート D1 にマイグレーション適用"
	@echo "make clean              - node_modules / build 成果物を削除"

install:
	bun install

dev:
	@echo "▶ server: http://localhost:8787"
	@echo "▶ client: http://localhost:5173"
	@trap 'kill 0' INT TERM EXIT; \
		(cd server && bun run dev) & \
		(cd client && bun run dev) & \
		wait

dev-server:
	cd server && bun run dev

dev-client:
	cd client && bun run dev

build:
	cd client && bun run build

deploy:
	cd server && bun run deploy

typecheck:
	bun run --filter '*' typecheck

db-generate:
	cd server && bun run db:generate

db-migrate-local:
	cd server && bun run db:migrate:local

db-migrate-remote:
	cd server && bun run db:migrate:remote

clean:
	rm -rf node_modules client/node_modules server/node_modules \
	       client/dist server/.wrangler
