export default function registerChatEvents(io, socket) {
  
  socket.on("chat:message", (data) => {
    console.log("Mensagem recebida:", data);

    // Broadcast para todos
  socket.on('send_message', (data) => {
    // Broadcast para todos (troca conforme regra de envio por destinatário)
    io.emit('receive_message', data);
  });
})

}
