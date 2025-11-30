import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";

export default function registerMediaEvents(io, socket) {

  // Enviar imagem base64 (rápido, arquivos pequenos)
  socket.on("media:image-base64", (data) => {
    io.emit("media:image", {
      id: socket.id,
      type: "image",
      name: data.name || "image.png",
      base64: data.base64
    });
  });

  // Enviar áudio base64
  socket.on("media:audio-base64", (data) => {
    io.emit("media:audio", {
      id: socket.id,
      type: "audio",
      name: data.name || "audio.wav",
      base64: data.base64
    });
  });

  // Enviar vídeo base64 (curtos)
  socket.on("media:video-base64", (data) => {
    io.emit("media:video", {
      id: socket.id,
      type: "video",
      name: data.name || "video.mp4",
      base64: data.base64
    });
  });

  // Upload via URL (recomendado para mídias grandes)
  socket.on("media:url", (data) => {
    io.emit("media:url", {
      id: socket.id,
      type: data.type,
      url: data.url,
      name: data.name
    });
  });

}
