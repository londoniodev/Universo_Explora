import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadDir = path.resolve("uploads/psychologists");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueId = crypto.randomUUID();
    const ext = path.extname(file.originalname).toLowerCase();

    const newFilename = `${file.fieldname}-${timestamp}-${uniqueId}${ext}`;
    cb(null, newFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo JPG, PNG y PDF."));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});