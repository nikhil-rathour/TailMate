const mapsService  = require("../services/maps.service")
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;
    try {
        const coordinates = await mapsService.getAddressCoordinate(address);
        res.status(200).json({ coordinates });
    } catch (error) {
        res.status(404).json({ message: "coordinates not found" });
    }
}