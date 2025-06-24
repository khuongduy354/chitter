import { Kafka } from "kafkajs";
import * as dotenv from "dotenv";

dotenv.config();

// Initialize Kafka client
const kafka = new Kafka({
  clientId: "nodemsq-client",
  brokers: [process.env.KAFKA_URL || "localhost:9092"],
});

// Create consumer
const consumer = kafka.consumer({
  groupId: "nodemsq-group",
});

// Message handler
const processMessage = async (message: any) => {
  try {
    const messageValue = message.value.toString();
    console.log("Received message:", messageValue);

    // Parse the message (assuming format: content%from%room)
    const [content, from, room] = messageValue.split("%");
    console.log("Parsed message:", { content, from, room });

    // Add your message processing logic here
    // For example: store in database, forward to another service, etc.
  } catch (error) {
    console.error("Error processing message:", error);
  }
};

// Main consumer function
const run = async () => {
  try {
    // Connect to Kafka
    await consumer.connect();
    console.log("Connected to Kafka");

    // Subscribe to topic
    await consumer.subscribe({
      topic: "msg-persist",
      fromBeginning: true,
    });

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await processMessage(message);
      },
    });

    // Graceful shutdown handling
    const errorTypes = ["unhandledRejection", "uncaughtException"];
    const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

    errorTypes.forEach((type) => {
      process.on(type, async (e) => {
        try {
          console.log(`process.on ${type}`);
          console.error(e);
          await consumer.disconnect();
          process.exit(1);
        } catch (_) {
          process.exit(1);
        }
      });
    });

    signalTraps.forEach((type) => {
      process.once(type, async () => {
        try {
          await consumer.disconnect();
        } finally {
          process.kill(process.pid, type);
        }
      });
    });
  } catch (error) {
    console.error("Error in consumer:", error);
    await consumer.disconnect();
    process.exit(1);
  }
};

// Start the consumer
// run().catch(console.error);
