package main

import (
	"context"
	"fmt"

	"github.com/joho/godotenv"
)

func setup_env() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}
func main() {
	setup_env()

	topics := []string{"msg-persist"}
	reader := initialize_kafka_reader(topics[0])
  
  fmt.Println("Go service is running to store messages!")
	for {
		m, err := reader.ReadMessage(context.Background())
		if err != nil { 
      fmt.Println("Error when reading messages: ", err);
			continue
		}

		msg := string(m.Value)
		fmt.Println("Received msg from kafka: ", msg)
		payload := msg_str_to_bson(msg)

		coll := connect_mongo()
		write_message(coll, payload)
	} 
  fmt.Println("Go service is no longer listening")

}
