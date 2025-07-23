// const express = require('express');
// const router = express.Router();
// const petController = require('../controllers/pet.controller');
// const { verifyToken } = require('../middleware/auth.middleware');
// const { upload } = require('../controllers/pet.controller');

// // Public routes
// router.get('/pets', petController.getAllPets);
// router.get('/pets/:id', petController.getPetById);
// router.get('/owner-pets', petController.getPetsByOwnerEmail);

// // Protected routes - require authentication
// router.post('/add-pet', verifyToken, upload.single('img'), petController.addPet);
// router.put('/update-pet/:id', verifyToken, petController.updatePet);
// router.delete('/delete-pet/:id', verifyToken, petController.deletePet);

// module.exports = router;