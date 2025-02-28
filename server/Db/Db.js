const mongoose = require("mongoose")

const dbConnection = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGOODE_DATA_BASE)
        console.log("mongoose database connected successfuly ")
    } catch (error) {
        console.log("Failed to connect the mongoose data base ")
       
    }
}

module.exports = dbConnection