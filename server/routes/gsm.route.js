const express = require("express");
const { connectGSM } = require("../Controllers/gsm.controllar");


const router = express.Router();

router.post('/connect', connectGSM);

module.exports = router;
