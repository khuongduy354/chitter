async function sampel() {
  // db.movies.insertMany([
  //   {
  //     title: "Titanic",
  //     year: 1997,
  //     genres: ["Drama", "Romance"],
  //   },
  //   {
  //     title: "Spirited Away",
  //     year: 2001,
  //     genres: ["Animation", "Adventure", "Family"],
  //   },
  //   {
  //     title: "Casablanca",
  //     genres: ["Drama", "Romance", "War"],
  //   },
  // ]);
}
async function sample_rollback_mongosh() {
  db = connect("mongodb://localhost/sample_movie_db");
  // Create collections:
  db.getSiblingDB("mydb1").foo.insertOne(
    { abc: 0 },
    { writeConcern: { w: "majority", wtimeout: 2000 } }
  );
  db.getSiblingDB("mydb2").bar.insertOne(
    { xyz: 0 },
    { writeConcern: { w: "majority", wtimeout: 2000 } }
  );
  // Start a session.
  session = db.getMongo().startSession({ readPreference: { mode: "primary" } });
  coll1 = session.getDatabase("mydb1").foo;
  coll2 = session.getDatabase("mydb2").bar;
  // Start a transaction
  session.startTransaction({
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  });
  // Operations inside the transaction
  try {
    coll1.insertOne({ abc: 1 });
    coll2.insertOne({ xyz: 999 });
  } catch (error) {
    // Abort transaction on error
    session.abortTransaction();
    throw error;
  }
  // Commit the transaction using write concern set at transaction start
  session.commitTransaction();
  session.endSession();
}
async function sampel_rollback_ONLY_WORLWITH_MONGODBDRIVER() {
  //https://www.mongodb.com/docs/manual/core/transactions/#transactions-api

  // connect mongosh
  // load("./sample_connect.js")
  // use sample_movie_db
  // db.movies.find().pretty()
  // Prereq: Create collections.
  // await client
  //   .db('mydb1')
  //   .collection('foo')
  //   .insertOne({ abc: 0 }, { writeConcern: { w: 'majority' } });
  // await client
  //   .db('mydb2')
  //   .collection('bar')
  //   .insertOne({ xyz: 0 }, { writeConcern: { w: 'majority' } });
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const coll1 = client.db("mydb1").collection("foo");
      const coll2 = client.db("mydb2").collection("bar");
      // Important:: You must pass the session to the operations
      await coll1.insertOne({ abc: 1 }, { session });
      await coll2.insertOne({ xyz: 999 }, { session });

      // Simulate an error to trigger rollback
      throw new Error("Simulated error to trigger rollback");
    });
  } finally {
    await session.endSession();
    await client.close();
  }
}
