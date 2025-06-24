run-docker-compose: 
	docker compose --env-file ./Docker/.env -f ./Docker/docker-dev-compose.yml -f ./Docker/supabase/docker-compose.yml up

run-test-compose:
	docker compose -f ./Docker/test/docker-test-compose.yml up


stop-all-docker-compose: 
	docker compose  -f ./Docker/docker-dev-compose.yml -f ./Docker/supabase/docker-compose.yml down

refresh-express:
	docker compose -f ./Docker/docker-dev-compose.yml stop express && \
	docker build -t chitter/express:1.0 -f ./Docker/express/Dockerfile . && \
	docker compose -f ./Docker/docker-dev-compose.yml up -d express

refresh-go:
	docker compose -f ./Docker/docker-dev-compose.yml stop go && \
	docker build -t chitter/gomsq:1.0 -f ./Docker/gomsq/Dockerfile ./gopgms
	docker compose -f ./Docker/docker-dev-compose.yml up -d go



# run-supabase-compose:
# 	docker compose -f ./Docker/supabase/docker-compose.yml up 
# stop-supabase-compose:
# 	docker compose -f ./Docker/supabase/docker-compose.yml down


# run-docker:  
# 	docker run --env-file .env -p 8000:8000 selfhost-meet-chitter-be


build_all: build-docker-express build-docker-go

build-docker-express:
	docker build -t chitter/express:1.0 -f ./Docker/express/Dockerfile .

build-docker-go:
	docker build -t chitter/gomsq:1.0 -f ./Docker/gomsq/Dockerfile ./gopgms
