const server = require("./app");
const dbConnection = require("./Db/Db");

const port = process.env.PORT || 3001;
dbConnection()
    .then(() => {
        server.listen(port, () => {
            console.log(`Server is running on port  http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
        process.exit(1);
    });

    
// const { SerialPort } = require('serialport');

// const port = new SerialPort({
//   path: '/dev/ttyUSB0', // Change for Windows: 'COM3'
//   baudRate: 115200,
//   autoOpen: false,
// });

// port.open((err) => {
//   if (err) {
//     return console.error('❌ Error opening port:', err.message);
//   }
//   console.log('✅ Serial port opened successfully.');

//   const sendATCommand = (command, callback) => {
//     setTimeout(() => {
//       port.write(command + '\r\n', (err) => {
//         if (err) {
//           return console.error('❌ Error writing to port:', err.message);
//         }
//         console.log(`📤 Sent: ${command}`);
//         if (callback) callback();
//       });
//     }, 1000); // 1-second delay to prevent overflow
//   };

//   port.on('data', (data) => {
//     const response = data.toString().trim();
//     console.log('📥 Received:', response);

//     if (response.includes('+QIACT:')) {
//       const ipAddress = response.match(/"([^"]+)"/)?.[1] || 'Unknown';
//       console.log('🌐 SIM IP Address:', ipAddress);
//     }

//     if (response.includes('+QIOPEN:')) {
//       if (response.includes('+QIOPEN: 0,0')) {
//         console.log('✅ TCP connection opened successfully.');

//         sendATCommand('AT+QISTATE=0,1', () => {
//           sendATCommand('AT+QISEND=0,5', () => {
//             port.write('hello', (err) => {
//               if (err) {
//                 return console.error('❌ Error sending data:', err.message);
//               }
//               console.log('✅ Data sent: hello');
//             });
//           });
//         });
//       } else {
//         console.error('❌ TCP Connection Failed. Retrying in 5 seconds...');
//         setTimeout(() => {
//           sendATCommand('AT+QICLOSE=0', () => {
//             sendATCommand('AT+QIACT=1', () => {
//               sendATCommand('AT+QIOPEN=1,0,"TCP","10.206.67.5",8888');
//             });
//           });
//         }, 5000);
//       }
//     }

//     if (response.includes('ERROR') || response.includes('+CME ERROR: 58')) {
//       console.error('❌ Network/Command Error. Resetting module...');
//       sendATCommand('AT+CFUN=0', () => {
//         setTimeout(() => {
//           sendATCommand('AT+CFUN=1', () => {
//             sendATCommand('AT+QISTATE=0,1');
//           });
//         }, 5000);
//       });
//     }
//   });

//   // ✅ **Optimized AT Command Sequence**
//   sendATCommand('AT', () => {
//     sendATCommand('AT+CGMM', () => {
//       sendATCommand('AT+CFUN=1', () => {
//         sendATCommand('AT+CREG?', () => {
//           sendATCommand('AT+CPIN?', () => {
//             sendATCommand('AT+CGSN', () => {
//               sendATCommand('AT+QCFG="nwscanmode"', () => {
//                 sendATCommand('AT+CGATT=1', () => {
//                   sendATCommand('AT+CSQ', () => {
//                     sendATCommand('AT+QSPN', () => {
//                       sendATCommand('AT+QCFG="band"', () => {
//                         sendATCommand('AT+QIDEACT=1', () => {

//                           // ✅ **Ensure Correct APN Setup**
//                           sendATCommand('AT+QICSGP=1,1,"jazzconnect.mobilinkworld.com","","",1', () => {
//                             sendATCommand('AT+CGATT=1', () => {
//                               sendATCommand('AT+QIACT=1', () => {
//                                 sendATCommand('AT+QIACT?', () => {
//                                   sendATCommand('AT+QISTATE=0,1', () => {

//                                     // ✅ **TCP Open with Retry**
//                                     sendATCommand('AT+QIOPEN=1,0,"TCP","10.206.67.5",8888', () => {
//                                       console.log('🌍 Establishing TCP connection...');
//                                     });

//                                   });
//                                 });
//                               });
//                             });
//                           });

//                         });
//                       });
//                     });
//                   });
//                 });
//               });
//             });
//           });
//         });
//       });
//     });
//   });
// });

// // Handle serial port errors
// port.on('error', (err) => {
//   console.error('❌ Serial Port Error:', err.message);
// });

// const { SerialPort } = require("serialport");

// // ✅ Configure Serial Port
// const port = new SerialPort({
//   path: "/dev/ttyUSB0", // Change to the correct port (Windows: 'COM3')
//   baudRate: 115200,
//   autoOpen: false,
// });

// // ✅ Function to Send AT Commands
// const sendATCommand = (command, delay = 1000) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       port.write(command + "\r\n", (err) => {
//         if (err) {
//           console.error("❌ Error writing to port:", err.message);
//           return reject(err);
//         }
//         console.log(`📤 Sent: ${command}`);
//       });
//     }, delay);

//     port.once("data", (data) => {
//       const response = data.toString().trim();
//       console.log("📥 Received:", response);
//       resolve(response);
//     });
//   });
// };

// // // ✅ Function to Execute AT Commands
// const executeCommands = async () => {
//   try {
//     console.log("📡 Initializing Modem and Checking Status...");

//     await sendATCommand("AT");            // Basic Check
//     await sendATCommand("AT+CFUN=1");     // Full Function Mode
//     await sendATCommand("AT+CREG?");      // Network Registration
//     await sendATCommand("AT+CPIN?");      // SIM Status
//     await sendATCommand("AT+CGSN");       // IMEI Number
//     await sendATCommand("AT+CSQ");        // Signal Quality
//     await sendATCommand("AT+CGATT?");     // Check GPRS Attachment
//     await sendATCommand("AT+QSPN");       // Service Provider Name

//     // ✅ Ensure Network is Attached
//     const gprsStatus = await sendATCommand("AT+CGATT?");
//     if (!gprsStatus.includes("+CGATT: 1")) {
//       console.error("❌ GPRS Not Attached. Retrying...");
//       await sendATCommand("AT+CGATT=1", 3000);
//     }

//     // ✅ Configure PDP Context (Use Correct APN)
//     await sendATCommand(`AT+QICSGP=1,1,"jazzconnect.mobilinkworld.com","","",1`); // Change APN accordingly
//     await sendATCommand("AT+QIACT?");   // Check Internet Activation
//     await sendATCommand("AT+QIACT=1");  // Activate Internet
//     await sendATCommand("AT+QIACT?");   // Confirm Internet Activation

//     // ✅ Check Local IP
//     await sendATCommand("AT+QILOCIP");

//     console.log("✅ Network Setup Completed. Now Setting Up TCP Server...");

//     // ✅ Open TCP Server
//     await sendATCommand("AT+QICLOSE=0");
//     await sendATCommand("AT+QISTATE=0,1");
//     await sendATCommand(`AT+QIOPEN=1,0,"TCP LISTENER","10.206.67.5",0,5000,1`);

//     console.log("✅ TCP Listener Started Successfully!");
//   } catch (error) {
//     console.error("❌ Error:", error.message);
//   }
// };




// // ✅ Open Serial Port & Execute Commands
// port.open(async (err) => {
//   if (err) {
//     return console.error("❌ Error opening port:", err.message);
//   }
//   console.log("✅ Serial port opened successfully.");
//   await executeCommands();
// });

// // ✅ Handle Serial Port Errors
// port.on("error", (err) => {
//   console.error("❌ Serial Port Error:", err.message);
// });
