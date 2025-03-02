const net = require("net");
const io = require("../middleware/socket.io");
const GMSModel = require("../models/GMS.model");

let clients = {};

const connectToGSM = (ip, port, res) => {
  if (!ip || !port) {
    return res.status(400).json({ error: 'IP and Port are required' });
  }

  if (clients[ip + ':' + port]) {
    return res.status(400).json({ error: 'Already connected to this server' });
  }

  const client = new net.Socket();

  client.connect(port, ip, () => {
    console.log(`✅ Connected to GSM Module at ${ip}:${port}`);
    res.json({ message: `Connected to ${ip}:${port}` });

    clients[ip + ':' + port] = client;

    // Send Welcome Message
    client.write('Hello from Node.js Server!\n');
  });

  // Receive data from GSM Module
  client.on('data', async (data) => {
    const receivedData = data.toString();
    console.log(`📥 Received from ${ip}:${port} →`, receivedData);

    // Store in MongoDB
    await GMSModel.create({ ip, port, message: receivedData });

    // Send data to frontend via WebSocket
    io.emit('gsmData', { ip, port, message: receivedData, timestamp: new Date() });
  });

  // Handle disconnection
  client.on('close', () => {
    console.log(`❌ Disconnected from ${ip}:${port}`);
    delete clients[ip + ':' + port];
  });

  client.on('error', (err) => {
    console.log(`❌ Error with ${ip}:${port}:`, err.message);
  });
};

module.exports = connectToGSM;
