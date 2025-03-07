const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const netServer=require("./gsm")


const SERVER_PORT = 8080;
const SERVER_IP = '0.0.0.0'; // Listen on all interfaces
// Define the Mongoose Model
// ✅ Net Server start karna
netServer.listen(SERVER_PORT, SERVER_IP, () => {
  console.log(`🚀 Net Server is listening on ${SERVER_IP}:${SERVER_PORT}`);
});
dotenv.config();
// cloudinary config
cloudinary.config({
  cloud_name: 'dzmcvxoah',
  api_key: '687945774492289',
  api_secret: 'S_4vTeRwTf5RncuUoc7k6FGft7A' // Click 'View API Keys' above to copy your API secret
});
const expressServer = express();
expressServer.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
expressServer.use(express.json());
expressServer.use(express.urlencoded({ extended: true }));
expressServer.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
expressServer.use(cookieParser());

// configure the routes
const userroutes = require("./routes/user.routes");

const gsmRoutes = require("./routes/gsm.route");

expressServer.use("/api/v1/gsm", gsmRoutes);
expressServer.use("/api/v1/user", userroutes);

module.exports = expressServer