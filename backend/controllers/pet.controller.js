const petService = require('../services/pet.service');

/**
 * Add a new pet
 */
const addPet = async (req, res) => {
  try {
    const petData = req.body;
    
    // Add owner from authenticated user
    if (req.user) {
      petData.owner = req.user._id;
    }
    
    const pet = await petService.createPet(petData);
    res.status(201).json({
      success: true,
      message: 'Pet added successfully',
      data: pet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all pets with optional filters
 */
const getAllPets = async (req, res) => {
  try {
    // Extract filters from query parameters
    const { type, listingType, breed } = req.query;
    
    // Create filters object
    const filters = {};
    if (type) filters.type = type;
    if (listingType) filters.listingType = listingType;
    if (breed) filters.breed = breed;
    
    const pets = await petService.getAllPets(filters);
    res.status(200).json({
      success: true,
      data: pets
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get pet by ID
 */
const getPetById = async (req, res) => {
  try {
    const pet = await petService.getPetById(req.params.id);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }
    res.status(200).json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get pets by owner email
 */
const getPetsByOwnerEmail = async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    
    if (!ownerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Owner email is required'
      });
    }
    
    const pets = await petService.getPetsByOwnerEmail(ownerEmail);
    res.status(200).json({
      success: true,
      data: pets
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



/**
 * Update pet
 */
const updatePet = async (req, res) => {
  try {
    const pet = await petService.getPetById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }
    
    // Check if user is the owner
    if (req.user && pet.ownerEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this pet'
      });
    }
    
    const updatedPet = await petService.updatePet(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Pet updated successfully',
      data: updatedPet
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete pet
 */
const deletePet = async (req, res) => {
  try {
    const pet = await petService.getPetById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }
    
    // Check if user is the owner
    if (req.user && pet.ownerEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this pet'
      });
    }
    
    await petService.deletePet(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Pet deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addPet,
  getAllPets,
  getPetById,
  getPetsByOwnerEmail,
  updatePet,
  deletePet
};