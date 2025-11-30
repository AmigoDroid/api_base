export default function registerCallEvents(io, socket) {
  
  socket.on("call:offer", (data) => {
    socket.to(data.to).emit("call:offer", {
      from: socket.id,
      offer: data.offer
    });
  });

  socket.on("call:answer", (data) => {
    socket.to(data.to).emit("call:answer", {
      from: socket.id,
      answer: data.answer
    });
  });

  socket.on("call:ice-candidate", (data) => {
    socket.to(data.to).emit("call:ice-candidate", {
      from: socket.id,
      candidate: data.candidate
    });
  });

}
