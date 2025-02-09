import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import path from "path";
import { createServer } from "http";
import { initSocket, getIO } from "./socket.js";

import authRoutes from "./routes/auth.routes.js";
import contextualizationRoute from "./routes/contextualization.routes.js";
import autoevaluationRoute from "./routes/autoevaluation.routes.js";
import sixteenpfquestionsRoutes from "./routes/Sixteenpfquestions.routes.js";
import sixteenpfanswersRoutes from "./routes/Sixteenpfanswers.routes.js";
import getCalculatedSixteenpfResultsRoutes from "./routes/Sixteenpfanswers.routes.js";
import getCalculatedAutoevaluationResultsRoutes from "./routes/autoevaluation.routes.js";
import getCompletedContextualizationAnswers from "./routes/contextualization.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import psychologistRoutes from "./routes/psychologist.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import shortcontextualizationRoutes from "./routes/shortcontextualization.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { verifyToken } from "./middleware/verifyToken.js";
import testAccessRoutes from "./routes/testAccess.routes.js";
import packageRoutes from "./routes/Package.routes.js";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// 🔥 **CREAR SERVIDOR HTTP**
const server = createServer(app);

// ✅ **INICIALIZAR SOCKET.IO**
initSocket(server);

// 📌 **Emitir eventos desde otros módulos**
export const emitPsychologistRequest = (userId) => {
  getIO().emit("newPsychologistRequest", { userId });
};

// 🔥 **Configurar Rutas**
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contextualization", verifyToken, contextualizationRoute);
app.use("/api/autoevaluation", verifyToken, autoevaluationRoute);
app.use("/api/purchase", verifyToken, purchaseRoutes);
app.use("/api/questions", verifyToken, sixteenpfquestionsRoutes);
app.use("/api/answers", verifyToken, sixteenpfanswersRoutes);
app.use("/api/sixteenpfresults", verifyToken, getCalculatedSixteenpfResultsRoutes);
app.use("/api/autoevaluacionresults", verifyToken, getCalculatedAutoevaluationResultsRoutes);
app.use("/api/contextualizationanswers", verifyToken, getCompletedContextualizationAnswers);
app.use("/api/psychologist", psychologistRoutes);
app.use("/api/short-contextualization", verifyToken, shortcontextualizationRoutes);
app.use("/api/cart", verifyToken, cartRoutes);
app.use("/api/test-access", verifyToken, testAccessRoutes);
app.use("/api/packages", verifyToken, packageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 4001;
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  }
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("🔴 Servidor cerrado. Puerto liberado.");
    process.exit(0);
  });
});