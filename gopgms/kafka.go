package main

import (
	"os"

	"github.com/segmentio/kafka-go"
)

func initiliaze_kafka_writer(topic string) *kafka.Writer {
	kafkaUrl := os.Getenv("KAFKA_URL")
	conf := kafka.WriterConfig{
		Brokers: []string{kafkaUrl},
		Topic:   topic,
	}

	writer := kafka.NewWriter(conf)
	return writer
}

func initialize_kafka_reader(topic string) *kafka.Reader {
	kafkaUrl := os.Getenv("KAFKA_URL")
	conf := kafka.ReaderConfig{
		Brokers:  []string{kafkaUrl},
		Topic:    topic,
		GroupID:  "g4",
		MaxBytes: 100,
	}

	reader := kafka.NewReader(conf)

	return reader
}
