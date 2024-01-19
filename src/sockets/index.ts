import { Server, Socket } from "socket.io";

export const SocketRouteHandler = (io: Server) => {
  // auth
  // io.use(async (socket: Socket, next) => {
  //   const value = await supabase.auth.getUser();
  //   if (value.data.user) {
  //     next();
  //   } else {
  //     const err = new Error("not authorized");
  //     next(err);
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
      (sender_id: string, receiver_id: string, content: string) => {
        let payload = { content, from: sender_id };
        io.to(receiver_id).to(sender_id).emit("userChatReceive", payload);
      }
    );
    socket.on("joinGroup", (group_id: string) => {
      socket.join(group_id);
    });

    socket.on(
      "groupChat",
      (sender_id: string, group_id: string, content: string) => {
        let payload = { content, from: sender_id };
        io.to(group_id).emit("groupChatReceive", payload);
      }
    );
  });
};
