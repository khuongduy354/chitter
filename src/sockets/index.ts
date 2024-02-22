import { Server, Socket } from "socket.io";
import { Message } from "../helper/mongodb";
import { supabase } from "../helper/supabase";

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

  io.on("connection", (socket) => {
    //initialize event, see sessions for this
    // socket.to(socket.id ).emit("initConnection", payload);
    console.log("user connected");

    // client connect then need to send initConnection with his id

    socket.on("initConnection", (userID: string) => {
      socket.join(userID);
      io.to(userID).emit("debugMsg", userID + " Joined");
    });

    socket.on(
      "userChat",
      async (sender_id: string, receiver_id: string, content: string) => {
        let payload = { content, from: sender_id };

        const { data: roomData } = await supabase.rpc("query_one_one_room", {
          u1: sender_id,
          u2: receiver_id,
        });
        if (roomData && roomData.length > 0) {
          await Message.insertOne({
            content,
            from: sender_id,
            room: roomData[0].id,
          });
          io.to(receiver_id).to(sender_id).emit("userChatReceive", payload);
        } else {
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
