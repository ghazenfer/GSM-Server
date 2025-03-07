const expressServer = require("./app");
const dbConnection = require("./Db/Db");

const port = process.env.PORT || 3001;
dbConnection()
    .then(() => {
        expressServer.listen(port, () => {
            console.log(`Server is running on port  http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
        process.exit(1);
    });







