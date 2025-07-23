import React, { useState } from 'react';
import { addDatingPet } from '../services/petDatingService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { motion } from 'framer-motion';

 


const petTypes = [
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
  { label: 'Bird', value: 'bird' },
  { label: 'Small Animal', value: 'small' },
];

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const listingTypes = [
  { label: 'Adoption', value: 'adoption' },
  { label: 'For Sale', value: 'sale' },
];

const CreateDatingPetpost = () => {
   const { userInfo} = useAuth();



  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    gender: 'male',
    breed: '',
    age: '',
    location: '',
    img: '',
    listingType: 'adoption',
    price: '',
    description: '',
    ownerEmail : userInfo.email,
    ownerData : userInfo,
    isDating : true
    

  });
  // console.log(userInfo);
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.breed || !formData.age || !formData.location || !imageFile || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate price for sale listings
    if (formData.listingType === 'sale' && (!formData.price || isNaN(formData.price))) {
      setError('Please enter a valid price for sale listings');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = new FormData();
      // Handle each form field appropriately
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'ownerData') {
          // Pass ownerData as a proper object
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });
      data.append('img', imageFile);
      const response = await addDatingPet(data);
      navigate('/dating'); // Redirect to pets page after successful creation
    } catch (err) {
      console.error('Failed to create pet listing:', err);
      setError(err.response?.data?.message || 'Failed to create pet listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-navy min-h-screen py-16 px-4 text-white">
      {/* Hero Section */}
      <section className="relative bg-navy py-8 flex items-center justify-center overflow-hidden mb-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center items-center text-center z-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Add Your Pet For Dating</h1>
          <p className="text-lg md:text-xl mb-4 text-gold font-medium drop-shadow">Add your pet to our community</p>
        </motion.div>
        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1601758123927-195e4b9f6e0e')] bg-cover bg-center opacity-20 z-0" />
      </section>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-gold/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500"
      >
        <h2 className="text-3xl font-bold mb-6 text-gold text-center">Pet Information</h2>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg mb-4 text-center"
          >
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Name */}
            <div>
              <label className="block text-gold mb-2 font-medium">Pet Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                required
              />
            </div>
            
            {/* Pet Type */}
            <div>
              <label className="block text-gold mb-2 font-medium">Pet Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                required
              >
                {petTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            {/* Gender */}
            <div>
              <label className="block text-gold mb-2 font-medium">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                required
              >
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Breed */}
            <div>
              <label className="block text-gold mb-2 font-medium">Breed *</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                required
              />
            </div>
            
            {/* Age */}
            <div>
              <label className="block text-gold mb-2 font-medium">Age (years) *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                required
              />
            </div>
            
            {/* Location */}
            <div>
              <label className="block text-gold mb-2 font-medium">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                required
              />
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-gold mb-2 font-medium">Image *</label>
              <input
                type="file"
                name="img"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-navy hover:file:bg-accent-orange"
                required
              />
            </div>
            
            {/* Listing Type 
            <div>
              <label className="block text-gold mb-2 font-medium">Listing Type *</label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                required
              >
                {listingTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div> */

            /* Price (only for sale listings)
            {formData.listingType === 'sale' && (
              <div>
                <label className="block text-gold mb-2 font-medium">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                  required
                />
              </div>
            )} */}

          </div> 
          
          {/* Description */}
          <div className="mt-6">
            <label className="block text-gold mb-2 font-medium">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
              required
            ></textarea>
          </div>
          
          {/* Preview Image */}
          {imagePreview && (
            <div className="mt-6">
              <label className="block text-gold mb-2 font-medium">Image Preview</label>
              <div className="h-60 w-full rounded-lg overflow-hidden shadow-lg border border-gold/30">
                <img 
                  src={imagePreview} 
                  alt="Pet preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <div className="mt-10 text-center">
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                type="button"
                onClick={() => navigate('/petsection')}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto border border-white/30"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105 disabled:opacity-50 w-full sm:w-auto"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateDatingPetpost;