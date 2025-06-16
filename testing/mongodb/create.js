db.createCollection("messages", {
  timeseries: {
    timeField: "timestamp", // When message was sent
    metaField: "chatId", // Which chat room/conversation
    granularity: "seconds", // Best for real-time messaging
  },
});
// db.messages.find({
//   timestamp: { $gt: lastSeenTimestamp }
// }).sort({timestamp: 1});
function comments() {
  let sample = {
    timestamp: new Date(), // Auto-indexed
    chatId: "user1-user2", // Grouped physically with other messages in this chat
    from: "user1",
    text: "Hey there!",
    read: false,
  };
}

// oneoneroomid;
// groupid;

// Query: get 10 recent messages in X room (given chatId);
// db.messages.find(
//   { chatId: "your_chat_id_here" }  // Filter by chat room
// )
// .sort({ timestamp: -1 })           // Sort newest first
// .limit(10)                         // Get only 10 messages

async function create_mock_db_with_rollback() {
  db = connect("mongodb://localhost/chitter");
  // Create collections:
  // db.getSiblingDB("mydb1").foo.insertOne(
  //   { abc: 0 },
  //   { writeConcern: { w: "majority", wtimeout: 2000 } }
  // );
  // db.getSiblingDB("mydb2").bar.insertOne(
  //   { xyz: 0 },
  //   { writeConcern: { w: "majority", wtimeout: 2000 } }
  // );
  // db.insertOne({
  //   timestamp: new Date(),
  //   chatId: "user1-user2",
  //   from: "user1",
  //   text: "Hello, world!",
  //   read: false,
  // });
  // Start a session.
  session = db.getMongo().startSession({ readPreference: { mode: "primary" } });
  msgCol = session.getDatabase("chitter").messages;
  // coll2 = session.getDatabase("mydb2").bar;
  // Start a transaction
  session.startTransaction({
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  });
  // Operations inside the transaction
  try {
    msgCol.insertOne({
      timestamp: new Date(),
      chatId: "user1-user2",
      from: "user1",
      text: "Hello, world!",
      read: false,
    });
  } catch (error) {
    // Abort transaction on error
    session.abortTransaction();
    throw error;
  }
  // Commit the transaction using write concern set at transaction start
  session.commitTransaction();
  session.endSession();
}
