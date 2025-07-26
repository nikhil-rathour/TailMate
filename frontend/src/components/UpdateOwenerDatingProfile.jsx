import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiHeart, FiMapPin, FiCamera, FiSave, FiArrowLeft } from 'react-icons/fi';
import { getMyOwnerDatingProfile, updateOwnerDatingProfile } from '../services/ownerDatingService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UpdateOwenerDatingProfile = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  
  const [profileId, setProfileId] = useState(null);
  const [formData, setFormData] = useState({
    OwnerAge: '',
    gender: '',
    location: '',
    bio: '',
    interests: [],
    hobbies: [],
    occupation: '',
    education: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const interestOptions = [
    'Dog Walking', 'Pet Training', 'Veterinary Care', 'Animal Rescue',
    'Photography', 'Hiking', 'Cooking', 'Reading', 'Music', 'Travel',
    'Fitness', 'Art', 'Gaming', 'Movies', 'Dancing'
  ];
  
  const hobbyOptions = [
    'Pet Grooming', 'Dog Shows', 'Cat Cafes', 'Bird Watching',
    'Gardening', 'Painting', 'Writing', 'Yoga', 'Running',
    'Swimming', 'Cycling', 'Volunteering', 'Crafting'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyOwnerDatingProfile();
        const profile = response.data;
        
        setProfileId(profile._id);
        setFormData({
          OwnerAge: profile.OwnerAge || '',
          gender: profile.gender || '',
          location: profile.location || '',
          bio: profile.bio || '',
          interests: profile.interests || [],
          hobbies: profile.hobbies || [],
          occupation: profile.occupation || '',
          education: profile.education || ''
        });
        
        setImagePreview(profile.ProfilePicture || '');
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach(item => formDataToSend.append(key, item));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (profileImage) {
        formDataToSend.append('ProfilePicture', profileImage);
      }
      
      const response = await updateOwnerDatingProfile(profileId, formDataToSend);
      setSuccess('Profile updated successfully!');
      
      // Refresh the form data with updated profile
      const updatedProfile = response.data;
      setFormData({
        OwnerAge: updatedProfile.OwnerAge || '',
        gender: updatedProfile.gender || '',
        location: updatedProfile.location || '',
        bio: updatedProfile.bio || '',
        interests: updatedProfile.interests || [],
        hobbies: updatedProfile.hobbies || [],
        occupation: updatedProfile.occupation || '',
        education: updatedProfile.education || ''
      });
      setImagePreview(updatedProfile.ProfilePicture || '');
      setProfileImage(null);
      
      setTimeout(() => {
        navigate(`/view-owner-dating-profile/${profileId}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="bg-navy min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profileId) {
    return (
      <div className="bg-navy min-h-screen flex justify-center items-center">
        <div className="text-white text-center">
          <p>Profile not found</p>
          <button 
            onClick={() => navigate('/owner-dating')}
            className="mt-4 bg-gold text-navy px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/view-owner-dating-profile/${profileId}`)}
            className="flex items-center gap-2 text-gold hover:text-accent-orange transition-colors"
          >
            <FiArrowLeft /> Back
          </motion.button>
          <h1 className="text-4xl font-bold text-gold">Update Dating Profile</h1>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-gold/20"
        >
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gold flex items-center gap-2">
                <FiUser /> Basic Information
              </h3>
              
              <div>
                <label className="block text-white mb-2">Age *</label>
                <input
                  type="number"
                  name="OwnerAge"
                  value={formData.OwnerAge}
                  onChange={handleInputChange}
                  min="18"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-gold"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white mb-2 flex items-center gap-2">
                  <FiMapPin /> Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gold flex items-center gap-2">
                <FiHeart /> Profile Details
              </h3>
              
              <div>
                <label className="block text-white mb-2 flex items-center gap-2">
                  <FiCamera /> Profile Picture
                </label>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-navy hover:file:bg-accent-orange focus:outline-none focus:border-gold"
                  />
                  {imagePreview && (
                    <div className="flex justify-center">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full object-cover border-2 border-gold"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-white mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  maxLength="500"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold resize-none"
                />
                <p className="text-white/50 text-sm mt-1">{formData.bio.length}/500 characters</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gold mb-4">Interests</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleArrayToggle('interests', interest)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    formData.interests.includes(interest)
                      ? 'bg-gold text-navy'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gold mb-4">Hobbies</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {hobbyOptions.map(hobby => (
                <button
                  key={hobby}
                  type="button"
                  onClick={() => handleArrayToggle('hobbies', hobby)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    formData.hobbies.includes(hobby)
                      ? 'bg-gold text-navy'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {hobby}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSave />
              )}
              {loading ? 'Updating Profile...' : 'Update Profile'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default UpdateOwenerDatingProfile;