// src/routes/mediaRoutes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { createMediaEntry, getMediaEntry } from "../utils/mediaStore.js";
import { getIO } from "../webSocket/index.js"; // usar getIO para notificar

const mediaRoutes = Router();

// Certifica que a pasta existe
const UPLOAD_DIR = path.resolve("uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer storage (guarda direto em uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// POST /media/upload  (multipart/form-data)  field: file
mediaRoutes.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Arquivo não enviado" });

    const { filename, path: filePath, mimetype, originalname, size } = req.file;
    let thumbPath = null;

    // Gerar thumbnail apenas para imagens
    if (mimetype && mimetype.startsWith("image/")) {
      const thumbName = `thumb-${filename}`;
      thumbPath = path.join(UPLOAD_DIR, thumbName);
      try {
        // sharp: redimensiona para 320px de largura (mantém ratio)
        await sharp(filePath).resize({ width: 320 }).toFile(thumbPath);
      } catch (err) {
        console.error("Falha ao gerar thumbnail:", err);
        thumbPath = null;
      }
    }

    // cria entrada e token (TTL padrão 1h)
    const token = createMediaEntry({
      filePath,
      thumbPath,
      mime: mimetype,
      name: originalname,
      size,
      ttlSeconds: 60 * 60 // 1 hora
    });

    const url = `/media/${token}`;
    const thumbUrl = thumbPath ? `/media/${token}/thumb` : null;

    // Notifica via socket (se houver instancia io)
    try {
      const io = getIO();
      io.emit("media:ready", {
        token,
        url,
        thumbUrl,
        name: originalname,
        mime: mimetype,
        size,
        expiresIn: 60 * 60
      });
    } catch (err) {
      // getIO lança se socket nao iniciado — tudo bem
    }

    return res.json({ success: true, token, url, thumbUrl, expiresIn: 60 * 60 });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Erro no upload" });
  }
});

// GET /media/:token  -> serve o arquivo original (se token válido)
mediaRoutes.get("/:token", (req, res) => {
  const { token } = req.params;
  const entry = getMediaEntry(token);
  if (!entry) return res.status(404).json({ success: false, message: "Arquivo não encontrado ou expirado" });

  res.setHeader("Content-Type", entry.mime || "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${entry.name}"`);
  res.sendFile(path.resolve(entry.filePath));
});

// GET /media/:token/thumb -> serve thumbnail
mediaRoutes.get("/:token/thumb", (req, res) => {
  const { token } = req.params;
  const entry = getMediaEntry(token);
  if (!entry || !entry.thumbPath) return res.status(404).json({ success: false, message: "Thumbnail não disponível" });

  // thumbnail é imagem
  res.setHeader("Content-Type", "image/jpeg");
  res.sendFile(path.resolve(entry.thumbPath));
});

export default mediaRoutes;
