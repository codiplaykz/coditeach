.PHONY: build run stop clean rebuild

PROJECT_NAME?=coditeach

# Build the Node.js application container
build:
	docker-compose -p $(PROJECT_NAME) -f go-compose.yaml build go-web-app

# Start the NGINX and Let's Encrypt proxy containers
nginx-up:
	docker-compose -p $(PROJECT_NAME) up -d

# Start the Node.js application container
run:
	docker-compose -p $(PROJECT_NAME) -f go-compose.yaml up -d

# Stop all the running containers
stop:
	docker-compose -p $(PROJECT_NAME) down
	docker-compose -p $(PROJECT_NAME) -f go-compose.yaml down

# Remove the Node.js application container image
clean:
	docker rmi $(docker images -q -f "label=com.docker.compose.project=$(coditeach)")

# Completely rebuild and restart everything
rebuild: stop clean build run
