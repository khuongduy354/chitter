import { check } from "k6";
// import { MongoClient } from "mongodb";

// MongoDB connection URI
const uri = "mongodb://localhost:27017";
const dbName = "k6_test";
const collectionName = "load_data";

// Test data template
function generateDocument(vuId) {
  return {
    vuId: vuId,
    timestamp: new Date(),
    data: `Test data from virtual user ${vuId}`,
    value: Math.random() * 100,
  };
}

export default async function () {
  const client = new MongoClient(uri);
  console.log("Running mongodb test ");

  try {
    // Connect to MongoDB
    // await client.connect();
    // const db = client.db(dbName);
    // const collection = db.collection(collectionName);
    // // Insert phase
    // const insertResult = await collection.insertOne(generateDocument(__VU));
    // check(insertResult, {
    //   "insert successful": (r) => r.acknowledged,
    // });
    // // Delete phase (simulate rollback)
    // if (__ITER % 2 === 0) {
    //   // Every other iteration
    //   const deleteResult = await collection.deleteOne({
    //     _id: insertResult.insertedId,
    //   });
    //   check(deleteResult, {
    //     "delete successful": (r) => r.acknowledged && r.deletedCount === 1,
    //   });
    // }
  } finally {
    // Clean up connection
    // await client.close();
  }
}
