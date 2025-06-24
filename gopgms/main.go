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
		fmt.Println(err)
	}
}

func mainmain(){
	setup_env()
	topics := []string{"msg-persist", "msg-persist-done"}
	// topics := []string{"msg-persist", "msg-persist-done"}
	reader := initialize_kafka_reader(topics[0])
	writer := initiliaze_kafka_writer(topics[1])

	fmt.Println("Connected to kafka!")
	coll := connect_mongo() 
	fmt.Println("Connected to MongoDB!")
	fmt.Println("Go service is running to read messages from kafka and store to mongodb!")

	ctx := context.Background()
	for {
		m, err := reader.ReadMessage(ctx)
		if err != nil { 
			fmt.Println("Error when reading messages: ", err)
			continue
		}

		msg := string(m.Value)
		fmt.Println("Received msg from kafka: ", msg)
		payload := msg_str_to_bson(msg) 
		if payload == nil {
			fmt.Println("Skipping message.");
			continue
		}

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


		// if err := reader.CommitMessages(ctx, m); err != nil {
        // 	fmt.Println("failed to commit messages:", err)
		// } 

	}
}
func test(){
  	conf := kafka.ReaderConfig{
    Brokers:  []string{"localhost:9092"},
		Topic:    "msg-persist",
		// GroupID:  gid,
		MaxBytes: 100,
	  }

    reader := kafka.NewReader(conf)
	fmt.Println("Go service is running to read messages from kafka!")

    // reader := initialize_kafka_reader("test-topic")
	for {
		m, err := reader.ReadMessage(context.Background())
		if err != nil {
			fmt.Println("Error when reading messages: ", err)
			continue
		}
		
		msg := string(m.Value)
		fmt.Println("Received msg from kafka: ", msg)
	}

} 
func main() { 
	mainmain(); 
	//test()
}
