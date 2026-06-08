import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Question from "../models/Sixtenpfquestion.model.js";

// Cargar variables de entorno del archivo .env en la raíz del proyecto
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const MONGO_URI = process.env.NODE_ENV === "production" ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL;

const seedIPVE = async () => {
  if (!MONGO_URI) {
    console.error("Error: MONGO_URI o MONGO_URI_LOCAL no está definido en el archivo .env.");
    process.exit(1);
  }

  try {
    console.log(`Conectando a la base de datos en: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log("Conexión a MongoDB establecida con éxito.");

    // Desactivar (soft-delete) las preguntas existentes en lugar de eliminarlas
    console.log("Desactivando la colección de preguntas antiguas...");
    const updateResult = await Question.updateMany({}, { $set: { isActive: false } });
    console.log(`Se desactivaron ${updateResult.modifiedCount} preguntas anteriores.`);

    // Leer el archivo sixteenpfquestions.json generado
    const jsonPath = path.resolve(process.cwd(), "sixteenpfquestions.json");
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`No se encontró el archivo sixteenpfquestions.json en la ruta: ${jsonPath}`);
    }

    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const questions = JSON.parse(rawData);

    // Insertar las nuevas preguntas
    console.log(`Insertando ${questions.length} preguntas nuevas de IPVE v2...`);
    const insertResult = await Question.insertMany(questions);
    console.log(`Inserción completa. Se crearon ${insertResult.length} registros en la base de datos.`);

    await mongoose.disconnect();
    console.log("Conexión a MongoDB cerrada.");
    process.exit(0);
  } catch (error) {
    console.error("Ocurrió un error al ejecutar el script de seed:", error);
    process.exit(1);
  }
};

seedIPVE();
