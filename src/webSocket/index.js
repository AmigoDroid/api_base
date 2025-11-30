import { Server } from "socket.io";
import registerChatEvents from "./chat.js";
import registerCallEvents from "./call.js";
import registerUserStatusEvents from "./userStatus.js";
import registerMediaEvents from "./media.js";
import { log } from "console";

let io = null;

export function setupSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" }
  });
  log("Socket.IO iniciado");

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Registrando módulos separados
    registerChatEvents(io, socket);
    registerCallEvents(io, socket);
    registerUserStatusEvents(io, socket);
    registerMediaEvents(io, socket);
  

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO ainda não foi inicializado");
  }
  return io;
}
