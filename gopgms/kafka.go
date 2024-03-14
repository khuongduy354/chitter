package main

import (
  "os" 

	"github.com/segmentio/kafka-go"
)

func initialize_kafka_reader(topic string) *kafka.Reader { 
  kafkaUrl:=os.Getenv("KAFKA_URL")
  conf := kafka.ReaderConfig{
    Brokers:  []string{kafkaUrl},
		Topic:    topic,
		GroupID:  "g4",
		MaxBytes: 100,
	}

	reader := kafka.NewReader(conf)

	return reader
}
