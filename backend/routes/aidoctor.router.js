const express = require("express");
const router = express.Router();
const aiDoctorController = require("../controllers/aidoctor.controller");

router.post("/doctor", aiDoctorController.getDoctor);

module.exports = router;
