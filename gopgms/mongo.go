package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func connect_mongo() *mongo.Collection {
	uri := os.Getenv("MONGODB_STRING")
	if uri == "" {
		fmt.Println("You must set your 'MONGODB_URI' environment variable. See\n\t https://www.mongodb.com/docs/drivers/go/current/usage-examples/#environment-variable")
	}
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		fmt.Println("MongoAtlas connect error: ", err)
	}

	// defer func() {
	// 	if err := client.Disconnect(context.TODO()); err != nil {
	// 		panic(err)
	// 	}
	// }()

	coll := client.Database("Chitter").Collection("Message")
	return coll
}

// func to_json(bs)([]byte){
//
//	  jsonData, err := json.MarshalIndent(bs, "", "    ")
//	  if err != nil {
//	    panic(err) // TODO: write to kafka
//	  }
//	  return jsonData
//	}
func msg_str_to_bson(msg string) bson.D {
	arr := strings.Split(msg, "%")
	if len(arr) != 3 {
		//TODO 
		fmt.Println("Error: message format is incorrect. Expected format: 'content%\from%room'")
		return nil
	}

	return bson.D{
		{Key: "content", Value: arr[0]},
		{Key: "from", Value: arr[1]},
		{Key: "room", Value: arr[2]}, 
		{Key: "timestamp", },
	}
}
func write_message_to_mongo(coll *mongo.Collection, payload bson.D) error {
	_, err := coll.InsertOne(
		context.TODO(),
		payload,
	)

	return err
}
