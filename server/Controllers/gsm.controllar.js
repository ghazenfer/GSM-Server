const connectToGSM = require("../service/TcpServer");


const connectGSM = (req, res) => {
  const { ip, port } = req.body;
  connectToGSM(ip, port, res);
};

module.exports = { connectGSM };
