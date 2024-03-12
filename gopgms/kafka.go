package main

import (
	"context"
	"fmt"

	"github.com/segmentio/kafka-go"
)

func read_kafka(){ 
	topic := "msg-persist"

	conf:=kafka.ReaderConfig{ 
		Brokers: []string{"localhost:9092"}, 
		Topic: topic, 
		GroupID: "g3",
		MaxBytes: 10,
	}

	reader:=kafka.NewReader(conf)

	for {
		m, err := reader.ReadMessage(context.Background())
		if err != nil {
			continue
		}
		fmt.Println(string(m.Value))
	}
}