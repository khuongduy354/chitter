run-docker-compose: 
	docker compose -f ./Docker/docker-dev-compose.yml up

run-kafka-compose:
	docker compose -f ./Docker/kafka/kafka-compose.yml up

stop-docker-compose: 
	docker compose -f ./Docker/docker-dev-compose.yml down

# run-docker:  
# 	docker run --env-file .env -p 8000:8000 selfhost-meet-chitter-be


build_all: build-docker-express build-docker-go

build-docker-express:
	docker build -t chitter/express:1.0 -f ./Docker/express/Dockerfile .

build-docker-go:
	docker build -t chitter/gomsq:1.0 -f ./Docker/gomsq/Dockerfile ./gopgms