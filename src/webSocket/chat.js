export default function registerChatEvents(io, socket) {
  
  socket.on("chat:message", (data) => {
    console.log("Mensagem recebida:", data);

    // Broadcast para todos
    io.emit("chat:message", {
      id: socket.id,
      ...data
    });
  });

}
