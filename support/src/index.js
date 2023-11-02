const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const { Server } = require("socket.io");

const StartServer = async () => {
  const app = express();

  await databaseConnection();
  await expressApp(app);

  app.get("/", (req, res) => {
    res.status(200).send({ message: "Order microservices called........" });
  });

  const server = app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });

  // Create a Socket.IO instance on top of the HTTP server
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
  });
  io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
      socket.join(userData.id);
      socket.emit("connected");
    });
    socket.on("join room", (room) => {
      socket.join(room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieve) => {
      var chat = newMessageRecieve.chatId;
      if (!chat.users) console.log("chats.users is not defined");
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieve.sender._id) return;
        socket.in(user._id).emit("message recieved", newMessageRecieve);
      });
    });
  });
};

StartServer();
