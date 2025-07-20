const Pet = require('../models/pets.model');

// pet create
const createPet = async (petData) => {
  const pet = new Pet(petData);
  return await pet.save();
};


// Get all pets with optional filters
const getAllPets = async (filters = {}) => {
  const query = {};
  
  // Apply type filter
  if (filters.type && filters.type !== 'all') {
    query.type = filters.type;
  }
  
  // Apply listing type filter
  if (filters.listingType && filters.listingType !== 'all') {
    query.listingType = filters.listingType;
  }
  
  // Apply breed filter (case-insensitive partial match)
  if (filters.breed && filters.breed.trim() !== '') {
    query.breed = { $regex: filters.breed, $options: 'i' };
  }
  
  return await Pet.find(query);
};

// Get pet by ID
const getPetById = async (id) => {
  return await Pet.findById(id);
};

// Get pets by owner email
const getPetsByOwnerEmail = async (email) => {
  return await Pet.find({ ownerEmail: email });
};

// Update pet

const updatePet = async (id, updateData) => {
  return await Pet.findByIdAndUpdate(
    id, 
    { ...updateData, updatedAt: Date.now() }, 
    { new: true }
  );
};

// Delete pet
const deletePet = async (id) => {
  return await Pet.findByIdAndDelete(id);
};

module.exports = {
  createPet,
  getAllPets,
  getPetById,
  getPetsByOwnerEmail,
  updatePet,
  deletePet
};