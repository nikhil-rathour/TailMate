// const { model } = require("mongoose")
const aiPetCareService = require("../services/aiPetCare.service")

module.exports.getAiPetCareData = async (req, res) => {
  const { petData } = req.body;
  if (!petData) {
    return res.status(400).json({ error: "pet info is required" });
  }
  const response = await aiPetCareService(petData);
  res.json({ result: response });
};