// const server = require("./app");
// const dbConnection = require("./Db/Db");

// const port = process.env.PORT || 3001;
// dbConnection()
//     .then(() => {
//         server.listen(port, () => {
//             console.log(`Server is running on port  http://localhost:${port}`);
//         });
//     })
//     .catch((error) => {
//         console.error("Error connecting to database:", error);
//         process.exit(1);
//     });



const net = require('net');
const readline = require('readline');
const mongoose = require('mongoose');

const SERVER_PORT = 8080;
const SERVER_IP = '0.0.0.0'; // Listen on all interfaces

const clients = new Set(); // ✅ Connected clients ko track karne ke liye Set
const buffers = new Map(); // ✅ Har client ka buffer store karne ke liye

// ✅ MongoDB Connection
mongoose.connect('mongodb+srv://shishalover848:0JhdwOX4KB662GIK@cluster0.eg4dc.mongodb.net', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// ✅ Message Schema & Model
const messageSchema = new mongoose.Schema({
  clientIP: String,
  clientPort: Number,
  message: String,
  type: String, // ✅ "sent" ya "received" ke liye
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// ✅ Readline interface for manual input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const server = net.createServer((socket) => {
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

// ✅ Server start karna
server.listen(SERVER_PORT, SERVER_IP, () => {
  console.log(`🚀 Server is listening on ${SERVER_IP}:${SERVER_PORT}`);
});

server.on('error', (err) => {
  console.log('❌ Server error:', err.message);
});
