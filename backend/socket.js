import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("🟢 Nuevo cliente conectado:", socket.id);
  
    socket.on("join-psychologist-room", (psychologistId) => {
      if (psychologistId) {
        socket.join(`psychologist-${psychologistId}`);
        console.log(`✅ Psicólogo ${psychologistId} se unió a la sala psychologist-${psychologistId}`);
      }
    });
  
    socket.on("leave-psychologist-room", (psychologistId) => {
      if (psychologistId) {
        socket.leave(`psychologist-${psychologistId}`);
        console.log(`❌ Psicólogo ${psychologistId} salió de la sala psychologist-${psychologistId}`);
      }
    });
  
    socket.on("disconnect", (reason) => {
      console.log(`🔴 Cliente desconectado: ${socket.id} - Razón: ${reason}`);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io no está inicializado.");
  }
  return io;
};