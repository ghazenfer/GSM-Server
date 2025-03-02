const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 New WebSocket Connection:", socket.id);
  });

  return io;
};

module.exports = { initializeSocket, getIO: () => io };
