import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto"; // 🔹 Para generar un ID único

// 📂 Directorio de almacenamiento para psicólogos
const uploadDir = path.resolve("uploads/psychologists");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 📌 Configuración de almacenamiento con nombre único
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // 🕒 Marca de tiempo
    const uniqueId = crypto.randomUUID(); // 🔹 UUID para evitar duplicados
    const ext = path.extname(file.originalname).toLowerCase(); // 📂 Obtener extensión en minúscula

    // 🔥 Generar nombre con marca de tiempo y UUID
    const newFilename = `${file.fieldname}-${timestamp}-${uniqueId}${ext}`;
    cb(null, newFilename);
  },
});

// 📌 Filtros de archivo (solo imágenes y PDF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo JPG, PNG y PDF."));
  }
};

// 📌 Middleware `multer` con límite de tamaño 5MB
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máx.
});