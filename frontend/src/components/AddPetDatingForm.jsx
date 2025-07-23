import React, { useState } from 'react';
import { addDatingPet } from '../services/petDatingService';
import { FiUpload, FiCheck } from 'react-icons/fi';

const AddPetDatingForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'Male',
    desc: '',
    location: '',
    activity: 'Medium',
    isDating: true, // Set isDating to true by default
  });
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData object to handle file upload
      const petFormData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        petFormData.append(key, formData[key]);
      });
      
      // Append image if available
      if (image) {
        petFormData.append('petImage', image);
      }
      
      // Call the service to add the pet
      await addDatingPet(petFormData);
      
      // Show success message and reset form
      setSuccess(true);
      setFormData({
        name: '',
        breed: '',
        age: '',
        gender: 'Male',
        desc: '',
        location: '',
        activity: 'Medium',
        isDating: true,
      });
      setImage(null);
      setPreview(null);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error adding pet:', err);
      setError('Failed to add pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gold/20">
      <h2 className="text-2xl font-bold mb-6 text-gold">Add Your Pet for Dating</h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
          <FiCheck className="text-green-500" />
          <span>Pet successfully added to dating!</span>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-white/80 mb-2">Pet Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          
          <div>
            <label className="block text-white/80 mb-2">Breed*</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          
          <div>
            <label className="block text-white/80 mb-2">Age*</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              placeholder="e.g. 2 years"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          
          <div>
            <label className="block text-white/80 mb-2">Gender*</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white/80 mb-2">Location*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g. San Francisco, CA"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          
          <div>
            <label className="block text-white/80 mb-2">Activity Level*</label>
            <select
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-white/80 mb-2">Description*</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-white/80 mb-2">Pet Image</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-gold/30 hover:bg-white/20 transition-all duration-300">
              <FiUpload className="text-gold" />
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {preview && (
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gold/30">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy py-3 px-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Adding Pet...' : 'Add Pet for Dating'}
        </button>
      </form>
    </div>
  );
};

export default AddPetDatingForm;