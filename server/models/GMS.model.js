const mongoose =require("mongoose")


const dataSchema = new mongoose.Schema({
    ip: String,
    port: Number,
    message: String,
    timestamp: { type: Date, default: Date.now }
  });

module.exports = mongoose.model("GsmData", dataSchema);