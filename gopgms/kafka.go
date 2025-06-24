package main

import (
	"fmt"
	"os"

	"github.com/segmentio/kafka-go"
)

func initiliaze_kafka_writer(topic string) *kafka.Writer {
	kafkaUrl := os.Getenv("KAFKA_URL") 
  if kafkaUrl == ""{ 
	fmt.Println("KAFKA_URL not set, using default localhost:9092 for writer")
    kafkaUrl="localhost:9092";
  }else{
	fmt.Println("KAFKA_URL is set to: ", kafkaUrl);
  }
	conf := kafka.WriterConfig{
		Brokers: []string{kafkaUrl},
		Topic:   topic,
	}

	writer := kafka.NewWriter(conf)
	return writer
}

func initialize_kafka_reader(topic string) *kafka.Reader {
	kafkaUrl := os.Getenv("KAFKA_URL") 
	gid := "g4" 
  if kafkaUrl == ""{   
	fmt.Println("KAFKA_URL not set, using default localhost:9092 for reader")
    kafkaUrl="localhost:9092";
  }else{
	fmt.Println("KAFKA_URL is set to: ", kafkaUrl);
  }
	conf := kafka.ReaderConfig{
		Brokers:  []string{kafkaUrl},
		Topic:    topic,
		GroupID:  gid,
		MaxBytes: 100,
	}

	reader := kafka.NewReader(conf)

	return reader
}
