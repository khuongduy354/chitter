package main

import (
	"github.com/segmentio/kafka-go"
)

func initialize_kafka_reader(topic string) *kafka.Reader {

	conf := kafka.ReaderConfig{
		Brokers:  []string{"localhost:9092"},
		Topic:    topic,
		GroupID:  "g4",
		MaxBytes: 100,
	}

	reader := kafka.NewReader(conf)

	return reader
}
