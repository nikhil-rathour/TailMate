const express =  require("express")
const router = express.Router()
const aiPetCareController = require("../controllers/aiPetCare.controller")

router.post("/aipetcare" , aiPetCareController.getAiPetCareData)

module.exports = router