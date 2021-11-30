const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const generateur = require("./Generateur");
const partiesRouter = require("./routes/partie");
const usersRouter = require("./routes/user");
const dataRouter = require("./routes/data");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io"),
  socketServer = new Server(8000, {
    cors: {
      origin: "http://localhost",
      methods: ["GET", "POST"],
    },
  });
let users = [];
// event fired every time a new client connects:
socketServer.on("connection", (socket) => {
  socket.on("login", (payload) => {
    const user = { userId: payload.userId, socketId: socket.id, bets: [] };
    users.push(user);
    console.log(user);
  });
  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
    //users = users.filter((user) => user.socketId !== socket.id);
  });
});

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/parties", partiesRouter);
app.use("/utilisateurs", usersRouter);
app.use("/data", dataRouter);
app.listen(3001);

function notifySockets(channel, payload) {
  socketServer.emit(channel, payload);
}

function notifyUser(userId, channel, payload) {
  const socketId = getSocketId(userId);
  if (socketId) {
    socketServer.to(socketId).emit(channel, payload);
  }
}

function getSocketId(userId) {
  for (i = 0; i < users.length; i++) {
    if (users[i].userId === userId) {
      return users[i].socketId;
    }
  }
  return null;
}

function getUsers() {
  return users;
}

generateur.demarrer();
module.exports.notifySockets = notifySockets;
module.exports.notifyUser = notifyUser;
module.exports.getUsers = getUsers;
module.exports = app;
