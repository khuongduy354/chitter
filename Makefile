run-docker-compose: 
	docker compose -f ./Docker/docker-dev-compose.yml up

stop-docker-compose: 
	docker compose -f ./Docker/docker-dev-compose.yml down

run-docker:  
	docker run --env-file .env -p 8000:8000 selfhost-meet-chitter-be

build-docker:
	docker build -t chitter/selfhost-meet-be:1.0 -f ./Docker/Dockerfile .
