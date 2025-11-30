export default function registerUserStatusEvents(io, socket) {

  // Atualiza o status do usuário
  socket.on("user:online", (userId) => {
    io.emit("user:online", { id: userId, socket: socket.id });
  });

  socket.on("user:typing", (userId) => {
    socket.broadcast.emit("user:typing", { id: userId });
  });

}
