DEV_SERVICES := postgres redis ollama

.PHONY: install install-dev dev db api customer admin partner api-local api-watch build lint test check logs ps stop

install:
	npm ci --include-workspace-root

install-dev:
	npm install --include-workspace-root

dev:
	docker compose up -d

db:
	docker compose up -d $(DEV_SERVICES)

api:
	docker compose up -d $(DEV_SERVICES) api

customer:
	npm run customer

admin:
	npm run admin

partner:
	npm run partner

api-local:
	npm run api:local

api-watch:
	npm run api:watch

build:
	npm run build

lint:
	npm run lint

test:
	npm run test

check:
	npm run check

logs:
	docker compose logs -f

ps:
	docker compose ps

stop:
	docker compose down
