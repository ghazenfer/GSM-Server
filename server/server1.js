const  { response }= require ("express")
const  { SerialPort } = require ("serialport");

const port = new SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: 115200,
  autio: false,
});

const sendATCommand = (command, delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      port.write(
        command + "\r\n",
        (err) => {
          if (err) {
            console.log("Error writing to Port " + command);
            return reject(err);
          }
        },
        delay
      );
      port.once("data", (data) => {
        const response = data.toString().trim();
        console.log("Received: " + response);
        resolve(response);
      });
    });
  });
};

// fUNCTION  to execute the At command

const executeCommands = async () => {
  try {
    console.log("📡 Initializing Modem and Checking Status...");

    const setupCommand = [
      "AT", // Basic Modem Check
      "AT+CGMM", // Get Module Model
      "AT+CFUN=1", // Full Function Mode
      "AT+CREG?", // Check Network Registration
      "AT+CPIN?", // Check SIM Status
      "AT+CGSN", // Get IMEI Number
      'AT+QCFG="nwscanmode"', // Network Scan Mode
      "AT+CGATT?", // Check GPRS Attachment
      "AT+CSQ", // Signal Quality
      "AT+QSPN", // Service Provider Name
      'AT+QCFG="band"', // Get Band Settings
      "AT+QIDEACT=1", // Deactivate Network Context
      'AT+QICSGP=1,1,"","","",0', // Configure PDP Context
      "AT+QIACT?", // Check Internet Activation
      "AT+QIACT=1", // Activate Internet
      "AT+QIACT?", // Confirm Internet Activation
      "AT+QISTATE=0,1", // Check Connection State
      "AT+QILOCIP", // Get Local IP Address
    ];

    for (const command of setupCommand) {
      await sendATCommand(command);
    }

    console.log("✅ Network Setup Completed. Now Setting Up TCP Server...");

    // ✅ Commands for Opening TCP Listener

    const tcpCommands = [
      "AT", // Check Modem Again
      "AT+CGMM", // Get Module Model
      "AT+CFUN=1", // Full Function Mode
      "AT+CREG?", // Check Network Registration
      "AT+CPIN?", // Check SIM Status
      "AT+CGSN", // Get IMEI Number
      'AT+QCFG="nwscanmode"', // Network Scan Mode
      "AT+CGATT?", // Check GPRS Attachment
      "AT+CSQ", // Signal Quality
      "AT+QSPN", // Service Provider Name

      // This command is not work

      'AT+QCFG="band"', // Get Band Settings
      "AT+QIDEACT=1", // Deactivate Network Context
      'AT+QICSGP=1,1,"","","",0', // Configure PDP Context
      "AT+QIACT?", // Check Internet Activation
      "AT+QIACT=1", // Activate Internet
      "AT+QIACT?", // Confirm Internet Activation
      "AT+QISTATE=0,1", // Check Connection State
      "AT+QICLOSE=0", // Close Any Open Connection
      "AT+QISTATE=0,1", // Check Connection State Again
      `AT+QIOPEN=1,0,"TCP LISTENER","10.206.67.5",0,5000,1`, // Open TCP Server
    ];
    for (const command of tcpCommands) {
      await sendATCommand(command);
    }
    console.log("�� TCP Listener Started Successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

// ✅ Open Serial Port & Execute Commands
port.open(async (err) => {
    if (err) {
      return console.error("❌ Error opening port:", err.message);
    }
    console.log("✅ Serial port opened successfully.");
    await executeCommands();
  });
  

// ✅ Handle Serial Port Errors
port.on("error", (err) => {
    console.error("❌ Serial Port Error:", err.message);
  });
