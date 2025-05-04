FROM golang:latest
WORKDIR /app  

COPY go.mod go.sum ./
RUN go mod download 

COPY . . 


# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /gomsq

# testing only, dont provide credentials in real world 
ENV KAFKA_URL=kafka:9092


CMD ["/gomsq"]