import React, { useState, useEffect } from 'react';
import { getPetById, updatePet } from "../services/petService";
import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from "../context/AuthContext";

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
    return <div className="flex justify-center items-center h-[60vh] text-gold text-xl">Loading pet data...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-[60vh] text-red-500 text-xl">{error}</div>;
  }
  if (!formData) return null;

  return (
    <div className="bg-navy min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 border-2 border-navy/10">
        <h1 className="text-2xl font-bold text-navy mb-6">Update Pet Listing</h1>
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">Pet updated successfully!</div>}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
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
              {loading ? 'Updating...' : 'Update Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePetForm; 