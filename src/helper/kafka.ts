import { Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";

let producer: null | Producer = null;
let kafka: Kafka | null = null;

function getKafkaInstance() {
  console.log("Initializing Kafka instance...");
  console.log("KAFKA_CLIENT_ID:", process.env.KAFKA_CLIENT_ID);
  if (!kafka) {
    const kafkaurl = process.env.KAFKA_URL || "localhost:9092";
    const clientId = process.env.KAFKA_CLIENT_ID || "kafka-client";
    console.log("KAFKA_URL:", kafkaurl);
    console.log("KAFKA_CLIENT_ID:", clientId);
    kafka = new Kafka({
      clientId,
      brokers: [kafkaurl],
    });
  }
  return kafka;
}

async function connectProducer() {
  if (!producer) {
    producer = getKafkaInstance().producer();
    await producer.connect();
    console.log("Kafka producer connected!");
  }
  return producer;
}

async function createConsumer(topic: string) {
  const consumer = getKafkaInstance().consumer({
    groupId: topic + "-group",
  });
  await consumer.connect();
  return consumer;
}

export async function disconnectKafka() {
  try {
    if (producer) {
      await producer.disconnect();
    }
  } catch (err) {
    console.error("Error disconnecting from Kafka:", err);
  }
}

export type KafkaMessage = {
  content: string;
  from: string;
  room: string;
};

export type KafkaConsumerCallback = (payload: {
  topic: string;
  partition: number;
  message: KafkaMessage;
}) => void;

export async function sendToKafka(
  topic: string,
  messages: string[],
  cb: (payload: any) => void
) {
  try {
    const producer = await connectProducer();
    const payload = {
      topic,
      messages: messages.map((message) => ({ value: message })),
    };
    await producer.send(payload);
    cb(payload);
  } catch (err) {
    console.error("Error sending to Kafka:", err);
    throw new Error("Failed to send message to Kafka");
  }
}

export async function subscribeTopic(topic: string, cb: KafkaConsumerCallback) {
  try {
    const consumer = await createConsumer(topic);
    await consumer.subscribe({ topic });
    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          const parsedMessage = parseKafkaStringToMsgJson(
            payload.message.value?.toString() || ""
          );
          if (!parsedMessage) {
            throw new Error("Failed to parse message");
          }
          cb({
            topic: payload.topic,
            partition: payload.partition,
            message: parsedMessage,
          });
        } catch (err) {
          console.error("Error processing Kafka message:", err);
        }
      },
    });

    // Return an object with disconnect method for cleanup
    return {
      disconnect: async () => {
        try {
          await consumer.disconnect();
        } catch (err) {
          console.error("Error disconnecting consumer:", err);
        }
      },
    };
  } catch (err) {
    // console.error("Error in subscribeTopic:", err);
    throw new Error(`Failed to subscribe to topic: ${err}, topic: ${topic}`);
  }
}

export const parseMsgJsonToKafkaString = (msg: {
  content: string;
  from: string;
  room: string;
}) => {
  return Object.values(msg).join("%");
};

export const parseKafkaStringToMsgJson = (msg: string): any => {
  try {
    const [content, from, room] = msg.split("%");
    return { content, from, room };
  } catch (err) {
    console.error("Error parsing Kafka message string:", err);
    return null;
  }
};
