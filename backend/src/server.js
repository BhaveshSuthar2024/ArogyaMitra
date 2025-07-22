import ConnectDB from './DB/index.js';
import { app } from './app.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config({ path: './.env' });

// 1. Create HTTP server from Express app
const server = http.createServer(app);

// 2. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Replace * with your frontend origin in production
    methods: ['GET', 'POST']
  }
});

// 3. Make io accessible in all controllers via app
app.set('io', io);

// 4. Socket.io logic
io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);

  // Doctor joins personal room to receive call requests
  socket.on('join-doctor-room', (doctorId) => {
    const roomName = `doctor-${doctorId}`;
    socket.join(roomName);
    console.log(`🧑‍⚕️ Doctor ${doctorId} joined room: ${roomName}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// 5. Connect DB and start server
ConnectDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  });
});
