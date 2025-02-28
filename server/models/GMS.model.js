const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


const noozleSchema = new mongoose.Schema({
    NoozleId: {
        type: String,
        required: true,
       
    },
    product: {
        type: String,
    },
    rate: {
        type: String,
      
    },
    lastesale: {
        type: String,
    },
    meterReadng: {
        type: String,
    }
})



module.exports = mongoose.model("Noozle", noozleSchema);





