import React, { useState, useEffect } from 'react';
import { getPetById, updatePet } from "../services/petService";
import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from "../context/AuthContext";
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

const UpdatePetForm = () => {
  // const { userInfo } = useAuth();
  const { petId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      setFetching(true);
      try {
        const response = await getPetById(petId);
        if (response && response.data) {
          setFormData({ ...response.data });
        } else {
          setError('Pet not found');
        }
      } catch (err) {
        setError('Failed to fetch pet data');
      } finally {
        setFetching(false);
      }
    };
    fetchPet();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.breed || !formData.age || !formData.location || !formData.img || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    if (isNaN(formData.age) || Number(formData.age) < 1 || String(formData.age).length > 4) {
      setError('Age must be a positive number (max 4 digits)');
      return;
    }
    if (typeof formData.weight !== 'undefined' && (isNaN(formData.weight) || Number(formData.weight) < 1 || String(formData.weight).length > 4)) {
      setError('Weight must be a positive number (max 4 digits)');
      return;
    }
    if (formData.listingType === 'sale' && (!formData.price || isNaN(formData.price))) {
      setError('Please enter a valid price for sale listings');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const petData = {
        ...formData,
        age: Number(formData.age),
        price: formData.price ? Number(formData.price) : undefined
      };
      await updatePet(petId, petData);
      setSuccess(true);
      setTimeout(() => navigate('/petsection'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="bg-navy min-h-screen flex justify-center items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gold text-2xl font-bold flex items-center"
        >
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading pet data...
        </motion.div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-navy min-h-screen flex justify-center items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-2xl font-bold"
        >
          {error}
        </motion.div>
      </div>
    );
  }
  if (!formData) return null;

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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Update Pet Informaton</h1>
          <p className="text-lg md:text-xl mb-4 text-gold font-medium drop-shadow">Update your pet's information</p>
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
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded-lg mb-4 animate-pulse text-center"
          >
            Pet updated successfully!
          </motion.div>
        )}
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
              <label className="block text-gold mb-2 font-medium">Age (weeks) *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                step="1"
                pattern="^[1-9][0-9]{0,3}$"
                maxLength={4}
                onInput={e => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  if (e.target.value.length > 4) e.target.value = e.target.value.slice(0, 4);
                  if (e.target.value !== '' && Number(e.target.value) < 1) e.target.value = '1';
                }}
                className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                required
              />
            </div>
            {/* Weight */}
            {typeof formData.weight !== 'undefined' && (
              <div>
                <label className="block text-gold mb-2 font-medium">Weight (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  pattern="^[1-9][0-9]{0,3}$"
                  maxLength={4}
                  onInput={e => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    if (e.target.value.length > 4) e.target.value = e.target.value.slice(0, 4);
                    if (e.target.value !== '' && Number(e.target.value) < 1) e.target.value = '1';
                  }}
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                  required
                />
              </div>
            )}
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
            {/* Image URL */}
         
            {/* Listing Type - only show if isDating is false */}
            {!formData.isDating && (
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
              </div>
            )}
            
            {/* Price (only for sale listings and not dating) */}
            {formData.listingType === 'sale' && !formData.isDating && (
              <div>
                <label className="block text-gold mb-2 font-medium">Price (₹) *</label>
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
            )}
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
          {formData.img && (
            <div className="mt-6">
              <label className="block text-gold mb-2 font-medium">Image Preview</label>
              <div className="h-60 w-full rounded-lg overflow-hidden shadow-lg border border-gold/30">
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
                {loading ? 'Updating...' : 'Update Pet'}
              </button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdatePetForm;