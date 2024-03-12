import { Kafka, Message } from "kafkajs";
const kafka = new Kafka({
  clientId: "my-app2",
  brokers: ["localhost:9092"],
});
export type KafkaConsumerCallback = (payload: {
  topic: string;
  partition: number;
  message: string;
}) => void;

export async function sendToKafka(topic: string, messages: [string]) {
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic,
    messages: messages.map((message) => {
      return { value: message };
    }),
  });
  await producer.disconnect();
}

export async function subscribeTopic(topic: string, cb: KafkaConsumerCallback) {
  const consumer = kafka.consumer({ groupId: "g1" });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async (payload: any) => {
      cb(payload);
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
