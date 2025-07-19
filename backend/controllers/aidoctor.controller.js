const aiDoctorService = require("../services/aidoctor.service");

module.exports.getDoctor = async (req, res) => {
  console.log('Request body:', req.body);
  const { location } = req.body;

  if (!location || !location.lat || !location.lng) {
    return res.status(400).json({ error: "Valid location { lat, lng } is required" });
  }

  try {
    console.log(`Searching for pet clinics near lat: ${location.lat}, lng: ${location.lng}`);
    const response = await aiDoctorService(location);
    console.log(`Found ${response.length} clinics`);
    res.status(200).json({ success: true, result: response });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ success: false, error: "Failed to fetch clinic data" });
  }
};
