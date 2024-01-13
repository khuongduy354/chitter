import { MongoClient } from "mongodb";

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_STRING as string;

const client = new MongoClient(uri, { monitorCommands: true });
export const Message = client.db("Chitter").collection("Message");
