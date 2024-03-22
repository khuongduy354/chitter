package main

import (
	"context"
	"fmt"

	"github.com/joho/godotenv"
	"github.com/segmentio/kafka-go"
)

func setup_env() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}
func main() {
	setup_env()

	topics := []string{"msg-persist", "msg-persist-done"}
	reader := initialize_kafka_reader(topics[0])
	writer := initiliaze_kafka_writer(topics[1])

	fmt.Println("Go service is running to store messages!")
	for {
		m, err := reader.ReadMessage(context.Background())
		if err != nil {
			fmt.Println("Error when reading messages: ", err)
			continue
		}

		msg := string(m.Value)
		fmt.Println("Received msg from kafka: ", msg)
		payload := msg_str_to_bson(msg)

		coll := connect_mongo()
		mongo_err := write_message_to_mongo(coll, payload)
		if mongo_err != nil {
			fmt.Println("Error when writing to mongo: ", mongo_err)
			continue
		} else {
			fmt.Println("Successfully written to mongo: ", msg)
			kafka_write_err := writer.WriteMessages(context.Background(), kafka.Message{
				Value: []byte(msg),
			})
			if kafka_write_err != nil {
				fmt.Println("Error when writing to kafka: ", kafka_write_err)
			} else {
				fmt.Println("Successfully written to kafka: ", msg)
			}
		}

	}
}
