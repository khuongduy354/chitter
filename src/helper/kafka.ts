import { Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";
// connect kafka on app startup

let producer: null | Producer = null;
let g1Consumer: null | Consumer = null;
async function connectKafka() {
  try {
    const kafkaurl =
      (process.env.KAFKA_URL as string) === undefined
        ? "localhost:9092"
        : (process.env.KAFKA_URL as string);
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || "kafka-client",
      brokers: [kafkaurl],
    });

    producer = kafka.producer();
    await producer.connect();
    console.log("Kafka producer connected!");

    const consumer = kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID || "kafka-group",
    });
    await consumer.connect();
  } catch (err) {
    throw err;
  }
}

export type KafkaConsumerCallback = (payload: {
  topic: string;
  partition: number;
  message: any;
}) => void;

export async function sendToKafka(
  topic: string,
  messages: [string],
  cb: Function
) {
  if (!producer) {
    await connectKafka();
  }
  const payload = {
    topic,
    messages: messages.map((message) => {
      return { value: message };
    }),
  };

  if (!producer) return;
  await producer.send(payload);
  cb(payload);
}

export async function subscribeTopic(topic: string, cb: KafkaConsumerCallback) {
  if (!g1Consumer) {
    await connectKafka();
  }

  if (!g1Consumer) return;
  await g1Consumer.subscribe({ topic, fromBeginning: true });
  await g1Consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
      let _payload = {
        ...payload,
        message: parseKafkaStringToMsgJson(
          payload.message.value?.toString() as string
        ),
      };
      cb(_payload);
    },
  });
}
export const parseMsgJsonToKafkaString = (msg: {
  content: string;
  from: string;
  room: string;
}) => {
  return Object.values(msg).join("%");
};

export const parseKafkaStringToMsgJson = (msg: string): any => {
  const [content, from, room] = msg.split("%");
  return { content, from, room };
};
