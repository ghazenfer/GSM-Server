const CatchAsynicHnadler = require("../utils/CatchAsynicHnadler");
const Message = require("../models/GMS.model")


exports.GetAllmessage=CatchAsynicHnadler(async(req,res,next)=>{
        const message=await Message.find()
        res.status(200).json({
          success:true,
          message,
        })
        })
