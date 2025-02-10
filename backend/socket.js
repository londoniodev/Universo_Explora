import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
    transports: ["websocket", "polling"], // Permite WebSockets pero con fallback a polling
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Cliente conectado: ${socket.id}`);

    // ✅ Unir al psicólogo a su sala cuando se conecta
    socket.on("join-psychologist-room", (psychologistId) => {
      if (psychologistId) {
        socket.join(`psychologist-${psychologistId}`);
        console.log(`👥 Psicólogo ${psychologistId} unido a su sala.`);
      }
    });

    // ✅ Permitir que el psicólogo deje la sala al desconectarse
    socket.on("leave-psychologist-room", (psychologistId) => {
      if (psychologistId) {
        socket.leave(`psychologist-${psychologistId}`);
        console.log(`👋 Psicólogo ${psychologistId} salió de su sala.`);
      }
    });

    // ✅ Notificar desconexión
    socket.on("disconnect", (reason) => {
      console.log(`🔴 Cliente desconectado: ${socket.id} (${reason})`);
    });
  });

  console.log("✅ Socket.io inicializado");
};

// 📌 Obtener la instancia de `io` en otros archivos
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io no está inicializado.");
  }
  return io;
};