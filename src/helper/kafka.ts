import { EachMessagePayload, Kafka, Message } from "kafkajs"; 
const kafkaurl = process.env.KAFKA_URL as string === undefined ? "localhost:9092" : process.env.KAFKA_URL as string;
const kafka = new Kafka({
  clientId: "my-app2",
  brokers: [kafkaurl],
});
export type KafkaConsumerCallback = (payload: {
  topic: string;
  partition: number;
  message: any;
}) => void; 

export async function sendToKafka(topic: string, messages: [string], cb: Function) {
  const producer = kafka.producer();
  await producer.connect(); 
  const payload = {
    topic,
    messages: messages.map((message) => {
      return { value: message };
    }),
  }
  await producer.send(payload); 
  cb(payload); 
  await producer.disconnect();
}

export async function subscribeTopic(topic: string, cb: KafkaConsumerCallback) {
  const consumer = kafka.consumer({ groupId: "g1" });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {  
      let _payload ={ 
        ...payload,
        message: parseKafkaStringToMsgJson(payload.message.value?.toString() as string),
      } 
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
  
export const parseKafkaStringToMsgJson = (msg: string):any => {
  const [content, from, room] = msg.split("%");
  return { content, from, room };
}
