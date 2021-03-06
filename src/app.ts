import express from 'express';
import http from 'http';
import io, { Socket } from 'socket.io';
import cors from 'cors';

const PORT = process.env.PORT || 5000;
const app = express();

let server = http.createServer(app);
let sio = new io.Server(server, { cors: { origin: '*' } });

app.use(cors());

sio.on('connection', (socket: Socket) => {
  socket.emit('initial', 'connected');

  socket.on('join room', (roomId: string) => {
    socket.join(roomId);
    socket.to(roomId).emit('response', `connected to room ${roomId}`);
  });

  socket.on('new message', ({ roomId, msg }) => {
    socket.to(roomId).emit('update', msg);
  });
});

server.listen(PORT, () =>
  console.log(`\n Server is listenling on port ${PORT}`)
);
