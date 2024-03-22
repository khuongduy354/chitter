import { Server, Socket } from "socket.io";
import { Message } from "../helper/mongodb";
import { supabase } from "../helper/supabase";
import {
  parseMsgJsonToKafkaString,
  sendToKafka,
  subscribeTopic,
} from "../helper/kafka";

export const SocketRouteHandler = (io: Server) => {
  // auth
  // io.use(async (socket: Socket, next) => {
  //   const value = await supabase.auth.getUser();
  //   if (value.data.user) {
  //     next();
  //   } else {
  //     const err = new Error("not authorized");
  //     next(err;
  //   }
  // });
  // kafka layer
  subscribeTopic("msg-persist-done", (payload) => { 
    console.log("msg-persist-done received: ", payload.message)
    const { from, room } = payload.message;
    io.to(from).to(room).emit("userChatReceive", payload.message);
  });
  subscribeTopic("msg-persist-err", (payload) => {
    const { from, room } = payload.message;
    io.to(from).to(room).emit("debugMsg", "Cannot persist message");
  });

  io.on("connection", (socket) => {
    //initialize event, see sessions for this
    // socket.to(socket.id ).emit("initConnection", payload);
    console.log("user connected");

    // client connect then need to send initConnection with his id
    socket.on("initConnection", (userID: string) => {
      socket.join(userID);
      socket.emit("debugMsg", userID + "Joined");
      io.to(userID).emit("debugMsg", userID + " Joined");
    });

    socket.on("ping", () => {
      console.log("pinged");
      socket.emit("pong");
    });

    socket.on(
      "userChat",
      async (sender_id: string, receiver_id: string, content: string) => {

        const { data: roomData } = await supabase.rpc("query_one_one_room", {
          u1: sender_id,
          u2: receiver_id,
        });
        if (roomData && roomData.length > 0) {
          const payload = {
            content,
            from: sender_id,
            room: roomData[0].id,
          }; 
          sendToKafka(
            "msg-persist",
            [parseMsgJsonToKafkaString(payload)],
            (payload:any) => {
              console.log("sent: ", payload);
            }
          );
        } else {
          console.log("No room found");
          io.to(receiver_id).to(sender_id).emit("debugMsg", "No room found");
        }
      }
    );
    socket.on("joinGroup", (group_id: string) => {
      socket.join(group_id);
    });

    socket.on(
      "groupChat",
      async (sender_id: string, group_id: string, content: string) => {
        let payload = { content, from: sender_id };
        await Message.insertOne({ content, from: sender_id, room: group_id });
        io.to(group_id).emit("groupChatReceive", payload);
      }
    );
  });
};
