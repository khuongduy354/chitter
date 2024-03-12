package main

import (
	"fmt"

	"github.com/joho/godotenv"
)

// TODO
// go ms
// - pickup kafka
// - store to db
// - done send done -> kafka

// nodejs
// - send kafka
// - listen kafka msg-persist done then send back
// - any error send error

func main() {  
	err:=godotenv.Load() 
	if err != nil { 
		fmt.Println("Error loading .env file")
	} 

	read_kafka() 
}
