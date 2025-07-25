import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiMapPin,
  FiUser,
  FiArrowLeft,
  FiStar,
  FiEye,
  FiHeart,
  FiMessageCircle,
} from "react-icons/fi";
import { getMyOwnerDatingProfile } from "../services/ownerDatingService";
import { getPetsByOwnerEmail } from "../services/petService";
import { useAuth } from "../context/AuthContext";
import {deleteOwnerDatingProfile }from "../services/ownerDatingService";


const ViewOwnerDatingProfile = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        setLoading(true);

        // Fetch user's own profile
        const profileResponse = await getMyOwnerDatingProfile();
        const profileData = profileResponse.data;

        // Fetch pets for this profile owner
        const petsResponse = await getPetsByOwnerEmail(profileData.user.email);
        const petsData = petsResponse.data || [];

        // Map pet data
        const mappedPets = Array.isArray(petsData)
          ? petsData.map((pet) => ({
              ...pet,
              image: pet.img,
              name: pet.name,
              breed: pet.breed,
              age: pet.age,
            }))
          : [];

        setProfile({
          ...profileData,
          pets: mappedPets,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, []);

  const getProfileStats = () => {
    if (!profile) return { views: 0, likes: 0, matches: 0 };

    return {
      views: Math.floor(Math.random() * 50) + 10,
      likes: profile.likes?.length || 0,
      matches: profile.matches?.length || 0,
    };
  };


 // delete profile function logic
const handleDeleteProfile = async () => {
  if (window.confirm('Are you sure you want to delete your dating profile? This action cannot be undone.')) {
    try {
      await deleteOwnerDatingProfile(profile._id);
      navigate('/owner-dating', { 
        replace: true,
        state: { message: 'Profile deleted successfully' }
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile. Please try again.');
    }
  }
};

  if (loading) {
    return (
      <div className="bg-navy min-h-screen flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-gold rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-navy min-h-screen flex justify-center items-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => navigate("/create-owner-dating-profile")}
            className="px-6 py-2 bg-gold text-navy rounded-lg hover:bg-accent-orange transition-all duration-300"
          >
            Create Dating Profile
          </button>
        </div>
      </div>
    );
  }

  const stats = getProfileStats();

  return (
    <div className="bg-navy min-h-screen text-white">
       <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/owner-dating")}
            className="flex items-center gap-2 text-gold hover:text-accent-orange transition-colors"
          >
            <FiArrowLeft /> Back
          </motion.button>
          <h1 className="text-xl font-bold text-gold">My Dating Profile</h1>
          
        </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-gold/20"
            >
              <div className="h-96 relative">
                <img
                  src={profile.ProfilePicture}
                  alt={profile.user.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile.isActive
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {profile.isActive ? "Active" : "Paused"}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {profile.user.name}, {profile.OwnerAge}
                  </h2>
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-gold" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiUser className="text-gold" />
                      <span className="capitalize">{profile.gender}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold/20"
            >
              <h3 className="text-xl font-semibold text-gold mb-4">About Me</h3>
              <p className="text-white/90 leading-relaxed">{profile.bio}</p>
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold/20"
            >
              <h3 className="text-xl font-semibold text-gold mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm">Occupation</p>
                  <p className="text-white font-medium">
                    {profile.occupation || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Education</p>
                  <p className="text-white font-medium">
                    {profile.education || "Not specified"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Interests & Hobbies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold/20"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gold mb-4">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests?.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gold mb-4">
                    Hobbies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.hobbies?.map((hobby, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-white/10 text-white rounded-full text-sm"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pets Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold/20"
            >
              <h3 className="text-xl font-semibold text-gold mb-4">My Pets</h3>
              {profile.pets?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.pets.map((pet, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 rounded-xl p-4 flex items-center gap-4"
                    >
                      <img
                        src={
                          pet.image ||
                          "https://via.placeholder.com/64x64/4A5568/FFFFFF?text=Pet"
                        }
                        alt={pet.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gold/30"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/64x64/4A5568/FFFFFF?text=Pet";
                        }}
                      />
                      <div>
                        <p className="font-semibold text-white">{pet.name}</p>
                        <p className="text-white/70 text-sm">{pet.breed}</p>
                        <p className="text-white/50 text-xs">
                          {pet.age} years old • {pet.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/50 mb-4">No pets listed</p>
                  <button
                    onClick={() => navigate("/add-pet")}
                    className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-all duration-300"
                  >
                    Add Pet
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold/20"
            >
              <h3 className="text-xl font-semibold text-gold mb-4 flex items-center gap-2">
                <FiStar /> Profile Stats
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiEye className="text-blue-400" />
                    <span className="text-white/80">Profile Views</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">
                    {stats.views}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiHeart className="text-red-400" />
                    <span className="text-white/80">Likes Received</span>
                  </div>
                  <span className="text-2xl font-bold text-red-400">
                    {stats.likes}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiMessageCircle className="text-green-400" />
                    <span className="text-white/80">Matches</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">
                    {stats.matches}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Profile Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold/20"
            >
              <h3 className="text-lg font-semibold text-gold mb-4">
                Profile Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    navigate(`/update-owner-dating-profile/${profile._id}`)
                  }
                  className="w-full flex items-center justify-center gap-3 py-3 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-all duration-300 border border-gold/30"
                >
                  <FiEdit /> Edit Profile
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center border-blue-400 justify-center gap-3 py-3 rounded-lg transition-all duration-300 border ${
                    profile.isActive
                      ? "bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30"
                      : "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                  }`}
                >
                  {profile.isActive ? "Pause Profile" : "Activate Profile"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteProfile}
                  className="border rounded-lg w-full flex items-center justify-center gap-3 py-3 transition-all duration-300 bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
                >
                  Delete Profile
                </motion.button>
              </div>
            </motion.div>

            {/* Profile Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold/20"
            >
              <h3 className="text-lg font-semibold text-gold mb-4">
                Profile Tips
              </h3>
              <div className="space-y-3 text-sm text-white/70">
                <p>• Add more photos to increase profile views</p>
                <p>• Complete all profile sections for better matches</p>
                <p>• Update your bio regularly to stay active</p>
                <p>• Add your pets to attract fellow pet lovers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOwnerDatingProfile;
