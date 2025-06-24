import { MongoClient } from "mongodb";

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_STRING as string;

// TODO: add types later
interface IMessage {}
interface ITheme {}

const client = new MongoClient(uri, { monitorCommands: true });
export const Message = client.db("Chitter").collection("Message");
export const Theme = client.db("Chitter").collection("Theme");
