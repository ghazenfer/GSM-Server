const express = require("express");
const { GetAllmessage } = require("../Controllers/gsm.controllar");


const router = express.Router();

router.get('/message', GetAllmessage);

module.exports = router;
