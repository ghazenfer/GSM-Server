
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

dotenv.config();

// cloudinary config
cloudinary.config({
  cloud_name: 'dzmcvxoah',
  api_key: '687945774492289',
  api_secret: 'S_4vTeRwTf5RncuUoc7k6FGft7A' // Click 'View API Keys' above to copy your API secret
});;

const server = express();
server.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
server.use(cookieParser());
// configure the routes
const userroutes = require("./routes/user.routes");
const gsmRoutes = require("./routes/gsm.route");

server.use("/api/v1/gsm", gsmRoutes);
server.use("/api/v1/user", userroutes)




// Start the server
module.exports = server;



