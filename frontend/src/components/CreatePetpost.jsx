import React, { useState } from 'react';
import { addPet } from "../services/petService";
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext"

 


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

const CreatePetpost = () => {
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
    ownerData : userInfo
    

  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.breed || !formData.age || !formData.location || !formData.img || !formData.description) {
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
      
      // Convert age to number
      const petData = {
        ...formData,
        age: Number(formData.age),
        price: formData.price ? Number(formData.price) : undefined
      };
      
      const response = await addPet(petData);
      navigate('/petsection'); // Redirect to pets page after successful creation
    } catch (err) {
      console.error('Failed to create pet listing:', err);
      setError(err.response?.data?.message || 'Failed to create pet listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-navy min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 border-2 border-navy/10">
        <h1 className="text-2xl font-bold text-navy mb-6">Create Pet Listing</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Name */}
            <div>
              <label className="block text-navy font-medium mb-2">Pet Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-2 border-navy/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              />
            </div>
            
            {/* Pet Type */}
            <div>
              <label className="block text-navy font-medium mb-2">Pet Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border-2 border-navy/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              >
                {petTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            {/* Gender */}
            <div>
              <label className="block text-navy font-medium mb-2">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border-2 border-navy/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              >
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Breed */}
            <div>
              <label className="block text-navy font-medium mb-2">Breed *</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full border-2 border-navy/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              />
            </div>
            
            {/* Age */}
            <div>
              <label className="block text-navy font-medium mb-2">Age (years) *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full border-2 border-navy/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              />
            </div>
            
            {/* Location */}
            <div>
              <label className="block text-navy font-medium mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                className="w-full border-2 border-navy/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              />
            </div>
            
            {/* Image URL */}
            <div>
              <label className="block text-navy font-medium mb-2">Image URL *</label>
              <input
                type="url"
                name="img"
                value={formData.img}
                onChange={handleChange}
                placeholder="https://example.com/pet-image.jpg"
                className="w-full border-2 border-navy/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              />
            </div>
            
            {/* Listing Type */}
            <div>
              <label className="block text-navy font-medium mb-2">Listing Type *</label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                className="w-full border-2 border-navy/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              >
                {listingTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            {/* Price (only for sale listings) */}
            {formData.listingType === 'sale' && (
              <div>
                <label className="block text-navy font-medium mb-2">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full border-2 border-navy/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30"
                  required
                />
              </div>
            )}
          </div>
          
          {/* Description */}
          <div className="mt-6">
            <label className="block text-navy font-medium mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border-2 border-navy/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30"
              required
            ></textarea>
          </div>
          
          {/* Preview Image */}
          {formData.img && (
            <div className="mt-6">
              <label className="block text-navy font-medium mb-2">Image Preview</label>
              <div className="h-48 w-full rounded-lg overflow-hidden">
                <img 
                  src={formData.img} 
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
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/petsection')}
              className="px-6 py-2 bg-gray-200 text-navy font-bold rounded-full hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gold text-navy font-bold rounded-full hover:bg-accent-orange transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePetpost;