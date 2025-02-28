const net = require('net');

const SERVER_PORT = 8080;
const SERVER_IP = '0.0.0.0'; // Listen on all interfaces

const server = net.createServer((socket) => {
  console.log('🌐 Client connected:', socket.remoteAddress, socket.remotePort);

  // Jab bhi GSM module data bhejega, ye function chalega
  socket.on('data', (data) => {
    console.log('📥 Received data:', data.toString());
  });

  // Agar GSM module disconnect ho jaye
  socket.on('end', () => {
    console.log('❌ Client disconnected');
  });

  // Agar koi error aaye
  socket.on('error', (err) => {
    console.log('❌ Socket error:', err.message);
  });

  // GSM module ko response dena
  socket.write('Hello from Node.js Server!\n');
});

// Server ko start karna
server.listen(SERVER_PORT, SERVER_IP, () => {
  console.log(`🚀 Server is listening on ${SERVER_IP}:${SERVER_PORT}`);
});

// Server error handle karna
server.on('error', (err) => {
  console.log('❌ Server error:', err.message);
});
