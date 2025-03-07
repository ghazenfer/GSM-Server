
const Message=require("./models/GMS.model")

const readline = require('readline');
const net = require('net');


const clients = new Set(); // ✅ Connected clients ko track karne ke liye Set
const buffers = new Map(); // ✅ Har client ka buffer store karne ke liye

const SERVER_PORT = 8080;
// ✅ Readline interface for manual input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const netServer = net.createServer((socket) => {
  console.log('🌐 Client connected:', socket.remoteAddress, socket.remotePort);
  clients.add(socket); // ✅ Client ko Set me add karo
  buffers.set(socket, ""); // ✅ Client ke liye empty buffer initialize karo

  socket.on('data', (data) => {
    const clientBuffer = buffers.get(socket) + data.toString(); // ✅ Buffer me add karo
    const messages = clientBuffer.split('\n'); // ✅ Agar newline hai, to split karna

    // ✅ Last incomplete message ko buffer me wapas store karna
    buffers.set(socket, messages.pop());

    // ✅ Sabhi complete messages process karo
    for (const message of messages) {
      const receivedMessage = message.trim();
      if (receivedMessage.length > 0) {
        console.log('📥 Received data:', receivedMessage);

        // ✅ Save Received Message to MongoDB
        const newMessage = new Message({
          clientIP: socket.remoteAddress,
          clientPort: socket.remotePort,
          message: receivedMessage,
          type: "received"
        });
        

        newMessage.save().then(() => {
          console.log('✅ Received message saved to database');
        }).catch(err => {
          console.error('❌ Error saving received message:', err);
        });

        // ✅ Client ko response bhejna
        socket.write(`✅ Received: ${receivedMessage}\n`);
      }
    }
  });

  socket.on('end', () => {
    console.log('❌ Client disconnected');
    clients.delete(socket); // ✅ Client ko remove karo    
    buffers.delete(socket); // ✅ Buffer remove karo
  });

  socket.on('error', (err) => {
    console.log('❌ Socket error:', err.message);
  });

  // ✅ Initial greeting message
  socket.write('Hello from Node.js Server!\n');
});

// ✅ Manually Message Send Karna (CLI)
rl.on('line', (input) => {
  if (clients.size === 0) {
    console.log('⚠️ No clients connected!');
    return;
  }

  console.log(`📤 Sending: ${input}`);

  // ✅ Sabhi connected clients ko message bhejo
  clients.forEach((client) => {
    client.write(`Server: ${input}\n`);

    // ✅ Save Sent Message to MongoDB
    const sentMessage = new Message({
      clientIP: "server",
      clientPort: SERVER_PORT,
      message: input,
      type: "sent"
    });

    sentMessage.save().then(() => {
      console.log('✅ Sent message saved to database');
    }).catch(err => {
      console.error('❌ Error saving sent message:', err);
    });
  });
});

module.exports=netServer