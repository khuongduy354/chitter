package main

import (
	"context"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func connect_mongo()(*mongo.Collection){      
  uri:=os.Getenv("MONGODB_STRING")
	if uri == "" {
		log.Fatal("You must set your 'MONGODB_URI' environment variable. See\n\t https://www.mongodb.com/docs/drivers/go/current/usage-examples/#environment-variable")
	}
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	coll := client.Database("sample_mflix").Collection("movies") 
  return coll 
} 
 
// func to_json(bs)([]byte){   
//   jsonData, err := json.MarshalIndent(bs, "", "    ")
//   if err != nil {
//     panic(err) // TODO: write to kafka 
//   } 
//   return jsonData
// }
func write_message(coll *mongo.Collection){ 
  _, err := coll.InsertOne(
    context.TODO(),
    bson.D{
        {Key: "animal", Value: "Dog"},
        {Key: "breed", Value: "Beagle"},
    },
)
  if err != nil { 
    //TODO
  } 
  
}
