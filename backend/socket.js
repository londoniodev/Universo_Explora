import { Server } from "socket.io";

let io;
const connectedUsers = new Map();

export const initSocket = (server) => {
  if (io) {
    console.warn("⚠️ Socket.io ya ha sido inicializado.");
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {

    socket.on("join-psychologist-room", (psychologistId) => {
      if (psychologistId) {
        socket.join(`psychologist-${psychologistId}`);
        connectedUsers.set(socket.id, psychologistId);

        socket.emit("joined-room", { message: "Te has unido a la sala de solicitudes pendientes." });
      } else {
        console.warn("⚠️ Intento de unirse a una sala con un ID inválido.");
      }
    });

    socket.on("leave-psychologist-room", (psychologistId) => {
      if (psychologistId) {
        socket.leave(`psychologist-${psychologistId}`);
        connectedUsers.delete(socket.id);
      }
    });

    socket.on("disconnect", (reason) => {
      const userId = connectedUsers.get(socket.id);
      if (userId) {
        connectedUsers.delete(socket.id);
      } else {
        console.log(`Cliente desconectado`);
      }
    });

    socket.on("new-request", ({ userId }) => {
      io.emit("new-request", { userId });
    });

    socket.on("request-removed", ({ userId }) => {
      io.emit("request-removed", { userId });
    });

    socket.on("assigned-user", ({ psychologistId, userId, message }) => {
      io.to(`psychologist-${psychologistId}`).emit("assigned-user", { psychologistId, userId, message });
      io.to(`psychologist-${psychologistId}`).emit("update-assigned-users");
    });

    socket.on("reassigned-user", ({ psychologistId, userId, message }) => {
      io.to(`psychologist-${psychologistId}`).emit("reassigned-user", { psychologistId, userId, message });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("❌ Socket.io no está inicializado.");
  }
  return io;
};