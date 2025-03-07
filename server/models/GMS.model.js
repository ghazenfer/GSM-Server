const mongoose=require("mongoose")

// ✅ Message Schema & Model
const messageSchema = new mongoose.Schema({
  clientIP: String,
  clientPort: Number,
  message: String,
  type: String, // ✅ "sent" ya "received" ke liye
  timestamp: { type: Date, default: Date.now }
});



module.exports = mongoose.model("Message", messageSchema);