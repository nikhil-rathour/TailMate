import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FiActivity,
  FiMoreVertical,
  FiShare2,
  FiBookmark,
  FiCamera,
  FiTrendingUp,
} from "react-icons/fi";
import { getMyOwnerDatingProfile, getOwnerDatingProfileById } from "../services/ownerDatingService";
import { getPetsByOwnerEmail } from "../services/petService";
import { useAuth } from "../context/AuthContext";
import {deleteOwnerDatingProfile }from "../services/ownerDatingService";


const ViewOwnerDatingProfile = () => {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const { userInfo } = useAuth();

  const [profile, setProfile] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compatibility, setCompatibility] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const isOwner = !profileId || (profile && profile.user.email === userInfo?.email);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        let profileData;
        if (profileId) {
          // Viewing someone else's profile
          const profileResponse = await getOwnerDatingProfileById(profileId);
          profileData = profileResponse.data;
          
          // Also fetch current user's profile for compatibility
          try {
            const myProfileResponse = await getMyOwnerDatingProfile();
            setMyProfile(myProfileResponse.data);
          } catch (err) {
            console.log("User doesn't have a profile yet");
          }
        } else {
          // Viewing own profile
          const profileResponse = await getMyOwnerDatingProfile();
          profileData = profileResponse.data;
        }

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
        setError(profileId ? "Failed to load profile." : "Failed to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);
  // console.log(pet);
  

  const getProfileStats = () => {
    if (!profile) return { views: 0, likes: 0, matches: 0 };

    return {
      views: Math.floor(Math.random() * 50) + 10,
      likes: profile.likes?.length || 0,
      matches: profile.matches?.length || 0,
    };
  };

  const calculateCompatibility = () => {
    if (!profile || !myProfile) return 0;
    
    let score = 0;
    let factors = 0;
    
    // Age compatibility (closer ages = higher score)
    const ageDiff = Math.abs(profile.OwnerAge - myProfile.OwnerAge);
    if (ageDiff <= 5) score += 25;
    else if (ageDiff <= 10) score += 15;
    else if (ageDiff <= 15) score += 5;
    factors++;
    
    // Interest compatibility
    const commonInterests = profile.interests?.filter(interest => 
      myProfile.interests?.includes(interest)
    ).length || 0;
    score += Math.min(commonInterests * 5, 25);
    factors++;
    
    // Hobby compatibility
    const commonHobbies = profile.hobbies?.filter(hobby => 
      myProfile.hobbies?.includes(hobby)
    ).length || 0;
    score += Math.min(commonHobbies * 5, 25);
    factors++;
    
    // Pet compatibility
    const bothHavePets = profile.pets?.length > 0 && myProfile.pets?.length > 0;
    if (bothHavePets) score += 25;
    else if (profile.pets?.length > 0 || myProfile.pets?.length > 0) score += 10;
    factors++;
    
    return Math.min(Math.round(score), 100);
  };

  useEffect(() => {
    if (profile && myProfile && !isOwner) {
      setCompatibility(calculateCompatibility());
    }
  }, [profile, myProfile, isOwner]);


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
    <div className="bg-gradient-to-br from-navy via-navy to-slate-900 min-h-screen text-white">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-50 bg-navy/80 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/owner-dating")}
              className="flex items-center gap-2 text-gold hover:text-accent-orange transition-all duration-300 font-medium"
            >
              <FiArrowLeft className="text-lg" /> 
              <span className="hidden sm:inline">Back to Dating</span>
              <span className="sm:hidden">Back</span>
            </motion.button>
            
            <div className="flex-1 text-center">
              <h1 className="text-lg sm:text-xl font-bold text-gold truncate px-4">
                {isOwner ? 'My Dating Profile' : `${profile?.user.name}'s Profile`}
              </h1>
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gold hover:text-accent-orange transition-colors"
            >
              <FiMoreVertical className="text-lg" />
            </motion.button>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {!isOwner && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isBookmarked ? 'bg-gold/20 text-gold' : 'bg-white/10 text-white/70 hover:text-gold'
                    }`}
                  >
                    <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/10 text-white/70 hover:text-gold rounded-lg transition-all duration-300"
                  >
                    <FiShare2 />
                  </motion.button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="lg:hidden absolute top-full left-0 right-0 bg-navy/95 backdrop-blur-md border-b border-gold/10 p-4"
              >
                {!isOwner && (
                  <div className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isBookmarked ? 'bg-gold/20 text-gold' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
                      {isBookmarked ? 'Saved' : 'Save'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 rounded-lg transition-all duration-300"
                    >
                      <FiShare2 /> Share
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Profile Section */}
          <div className="xl:col-span-3 lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Enhanced Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl lg:rounded-3xl overflow-hidden border border-gold/10 shadow-2xl"
            >
              <div className="h-64 sm:h-80 lg:h-96 relative group">
                <motion.img
                  src={profile.ProfilePicture}
                  alt={profile.user.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"></div>
                
                {/* Status Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4"
                >
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm border ${
                      profile.isActive
                        ? "bg-green-500/30 text-green-200 border-green-400/50 shadow-green-500/20"
                        : "bg-red-500/30 text-red-200 border-red-400/50 shadow-red-500/20"
                    } shadow-lg`}
                  >
                    <div className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      profile.isActive ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    {profile.isActive ? "Active" : "Paused"}
                  </span>
                </motion.div>
                
                {/* Profile Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
                      {profile.user.name}, {profile.OwnerAge}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/90">
                      <motion.div 
                        className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                      >
                        <FiMapPin className="text-gold text-sm" />
                        <span className="text-sm font-medium">{profile.location}</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                      >
                        <FiUser className="text-gold text-sm" />
                        <span className="text-sm font-medium capitalize">{profile.gender}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Quick Actions Overlay - Only for visitors */}
                {!isOwner && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-4 left-4 flex gap-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2.5 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                        isLiked 
                          ? 'bg-red-500/30 text-red-200 border-red-400/50' 
                          : 'bg-white/10 text-white/70 border-white/20 hover:bg-red-500/20 hover:text-red-300'
                      }`}
                    >
                      <FiHeart className={`text-lg ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Enhanced Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/10 hover:border-gold/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gold flex items-center gap-2">
                  <FiUser className="text-gold" />
                  About Me
                </h3>
                {profile.bio && profile.bio.length > 150 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="text-gold/70 hover:text-gold text-sm font-medium transition-colors"
                  >
                    {showFullBio ? 'Show Less' : 'Read More'}
                  </motion.button>
                )}
              </div>
              <motion.div
                layout
                className="text-white/90 leading-relaxed"
              >
                <p className={`${!showFullBio && profile.bio?.length > 150 ? 'line-clamp-3' : ''}`}>
                  {profile.bio || 'No bio available'}
                </p>
              </motion.div>
            </motion.div>

            {/* Enhanced Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/10 hover:border-gold/20 transition-all duration-300"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gold mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-gold" />
                Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div 
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-white/60 text-sm font-medium mb-1">Occupation</p>
                  <p className="text-white font-semibold">
                    {profile.occupation || "Not specified"}
                  </p>
                </motion.div>
                <motion.div 
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-white/60 text-sm font-medium mb-1">Education</p>
                  <p className="text-white font-semibold">
                    {profile.education || "Not specified"}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Compatibility Section (Only for visitors) */}
            {!isOwner && myProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-500 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="p-2 bg-purple-500/20 rounded-full"
                  >
                    <FiActivity className="text-purple-400 text-lg sm:text-xl" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold text-purple-300">Compatibility Score</h3>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Match Percentage</span>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      className="text-2xl sm:text-3xl font-bold text-purple-300"
                    >
                      {compatibility}%
                    </motion.span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-white/10 rounded-full h-3 sm:h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: `${compatibility}%`, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                        className={`h-full rounded-full relative ${
                          compatibility >= 80 ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-600' :
                          compatibility >= 60 ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600' :
                          compatibility >= 40 ? 'bg-gradient-to-r from-orange-400 via-red-500 to-orange-600' :
                          'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                        }`}
                      >
                        <motion.div
                          animate={{ x: [-10, 10, -10] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 bg-white/20 rounded-full"
                        />
                      </motion.div>
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className={`text-center p-3 sm:p-4 rounded-lg ${
                      compatibility >= 80 ? 'bg-green-500/10 border border-green-400/30' :
                      compatibility >= 60 ? 'bg-yellow-500/10 border border-yellow-400/30' :
                      compatibility >= 40 ? 'bg-orange-500/10 border border-orange-400/30' :
                      'bg-red-500/10 border border-red-400/30'
                    }`}
                  >
                    <p className="text-sm sm:text-base text-white/80 font-medium">
                      {compatibility >= 80 ? '🔥 Excellent match! You have a lot in common.' :
                       compatibility >= 60 ? '✨ Good compatibility! Worth getting to know.' :
                       compatibility >= 40 ? '💫 Some common ground to explore.' :
                       '🌟 Different interests can be exciting too!'}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Interests & Hobbies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: !isOwner && myProfile ? 0.4 : 0.3 }}
              className="bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/10 hover:border-gold/20 transition-all duration-300"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gold mb-4 flex items-center gap-2">
                    <FiStar className="text-gold" />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {profile.interests?.map((interest, idx) => {
                      const isCommon = !isOwner && myProfile?.interests?.includes(interest);
                      return (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium cursor-pointer transition-all duration-300 ${
                            isCommon 
                              ? 'bg-green-500/30 text-green-300 border border-green-400/50 shadow-green-500/20 shadow-lg' 
                              : 'bg-gold/20 text-gold hover:bg-gold/30 border border-gold/30'
                          }`}
                        >
                          {interest} {isCommon && '✨'}
                        </motion.span>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gold mb-4 flex items-center gap-2">
                    <FiActivity className="text-gold" />
                    Hobbies
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {profile.hobbies?.map((hobby, idx) => {
                      const isCommon = !isOwner && myProfile?.hobbies?.includes(hobby);
                      return (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 + 0.3 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium cursor-pointer transition-all duration-300 ${
                            isCommon 
                              ? 'bg-green-500/30 text-green-300 border border-green-400/50 shadow-green-500/20 shadow-lg' 
                              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                          }`}
                        >
                          {hobby} {isCommon && '✨'}
                        </motion.span>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Pets Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: !isOwner && myProfile ? 0.5 : 0.4 }}
              className="bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/10 hover:border-gold/20 transition-all duration-300"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gold mb-4 sm:mb-6 flex items-center gap-2">
                <FiCamera className="text-gold" />
                {isOwner ? 'My Pets' : `${profile.user.name}'s Pets`}
              </h3>
              {profile.pets?.length > 0 ? (
                <div
                  
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 "
                >
                  {profile.pets.map((pet, idx) => (
                    <motion.div
                          onClick={() => {
                                if (pet.isDating) {
                                  navigate(`/view-dating-pet/${pet._id}`);
                                } else {
                                  navigate(`/view-pet/${pet._id}`);
                                }
                              }}
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 + 0.2 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer border border-transparent hover:border-gold/20"
                    >
                      <div className="relative">
                        <motion.img
                          src={
                            pet.image ||
                            "https://via.placeholder.com/64x64/4A5568/FFFFFF?text=Pet"
                          }
                          alt={pet.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gold/30 shadow-lg"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/64x64/4A5568/FFFFFF?text=Pet";
                          }}
                          whileHover={{ scale: 1.1 }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-navy flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-white text-sm sm:text-base truncate">{pet.name}</p>
                          {/* Cute Purpose Labels */}
                          
                          
                          {pet.listingType === 'adoption' && (
                            <span className="px-2 py-0.5 bg-green-500/30 text-green-300 text-xs rounded-full border border-green-400/50 flex items-center gap-1">
                              🏠 Adoption
                            </span>
                          )}
                          {pet.listingType === 'sale' && (
                            <span className="px-2 py-0.5 bg-blue-500/30 text-blue-300 text-xs rounded-full border border-blue-400/50 flex items-center gap-1">
                              💰 Sale
                            </span>
                          )}
                         
                        </div>
                        <p className="text-white/70 text-xs sm:text-sm truncate">{pet.breed}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-white/50 text-xs">
                            {pet.age} years old
                          </span>
                          <span className="text-white/30">•</span>
                          <span className="text-white/50 text-xs capitalize">
                            {pet.type}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 sm:py-12"
                >
                  <div className="mb-4">
                    <FiCamera className="mx-auto text-4xl sm:text-5xl text-white/30 mb-3" />
                    <p className="text-white/50 mb-4 text-sm sm:text-base">No pets listed</p>
                  </div>
                  {isOwner && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/add-pet")}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-all duration-300 border border-gold/30 font-medium"
                    >
                      Add Pet
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="xl:col-span-1 space-y-4 lg:space-y-6">
            {/* Enhanced Profile Stats - Only for owner */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/10 hover:border-gold/20 transition-all duration-300"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gold mb-4 sm:mb-6 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <FiStar className="text-gold" />
                  </motion.div>
                  Profile Stats
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-full">
                        <FiEye className="text-blue-400 text-sm" />
                      </div>
                      <span className="text-white/80 font-medium text-sm sm:text-base">Profile Views</span>
                    </div>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="text-xl sm:text-2xl font-bold text-blue-400"
                    >
                      {stats.views}
                    </motion.span>
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-full">
                        <FiHeart className="text-red-400 text-sm" />
                      </div>
                      <span className="text-white/80 font-medium text-sm sm:text-base">Likes Received</span>
                    </div>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="text-xl sm:text-2xl font-bold text-red-400"
                    >
                      {stats.likes}
                    </motion.span>
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-full">
                        <FiMessageCircle className="text-green-400 text-sm" />
                      </div>
                      <span className="text-white/80 font-medium text-sm sm:text-base">Matches</span>
                    </div>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="text-xl sm:text-2xl font-bold text-green-400"
                    >
                      {stats.matches}
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Visitor Actions - Only for visitors */}
            {!isOwner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/10 hover:border-gold/20 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gold mb-4 sm:mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-full flex items-center justify-center gap-3 py-3 sm:py-4 rounded-lg transition-all duration-300 border font-medium ${
                      isLiked 
                        ? 'bg-red-500/30 text-red-200 border-red-400/50 shadow-red-500/20 shadow-lg' 
                        : 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30 hover:shadow-red-500/20 hover:shadow-lg'
                    }`}
                  >
                    <motion.div
                      animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <FiHeart className={`text-lg ${isLiked ? 'fill-current' : ''}`} />
                    </motion.div>
                    {isLiked ? 'Liked!' : 'Like Profile'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 py-3 sm:py-4 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30 hover:shadow-blue-500/20 hover:shadow-lg font-medium"
                  >
                    <FiMessageCircle className="text-lg" /> Send Message
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`w-full flex items-center justify-center gap-3 py-3 sm:py-4 rounded-lg transition-all duration-300 border font-medium ${
                      isBookmarked 
                        ? 'bg-gold/30 text-gold border-gold/50 shadow-gold/20 shadow-lg' 
                        : 'bg-gold/20 text-gold border-gold/30 hover:bg-gold/30 hover:shadow-gold/20 hover:shadow-lg'
                    }`}
                  >
                    <FiBookmark className={`text-lg ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save Profile'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Enhanced Profile Actions - Only for owner */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/10 hover:border-gold/20 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gold mb-4 sm:mb-6">
                  Profile Management
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      navigate(`/update-owner-dating-profile/${profile._id}`)
                    }
                    className="w-full flex items-center justify-center gap-3 py-3 sm:py-4 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-all duration-300 border border-gold/30 hover:shadow-gold/20 hover:shadow-lg font-medium"
                  >
                    <FiEdit className="text-lg" /> Edit Profile
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-3 py-3 sm:py-4 rounded-lg transition-all duration-300 border font-medium ${
                      profile.isActive
                        ? "bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30 hover:shadow-orange-500/20 hover:shadow-lg"
                        : "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 hover:shadow-green-500/20 hover:shadow-lg"
                    }`}
                  >
                    <FiActivity className="text-lg" />
                    {profile.isActive ? "Pause Profile" : "Activate Profile"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteProfile}
                    className="w-full flex items-center justify-center gap-3 py-3 sm:py-4 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300 border border-red-500/30 hover:shadow-red-500/20 hover:shadow-lg font-medium"
                  >
                    <FiMessageCircle className="text-lg" /> Delete Profile
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Enhanced Profile Tips - Only for owner */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-green-500/5 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-purple-400/20 hover:border-purple-400/30 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-purple-300 mb-4 sm:mb-6 flex items-center gap-2">
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FiTrendingUp className="text-purple-400" />
                  </motion.div>
                  Profile Tips
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { icon: FiCamera, text: "Add more photos to increase profile views", color: "text-blue-400" },
                    { icon: FiEdit, text: "Complete all profile sections for better matches", color: "text-green-400" },
                    { icon: FiActivity, text: "Update your bio regularly to stay active", color: "text-yellow-400" },
                    { icon: FiHeart, text: "Add your pets to attract fellow pet lovers", color: "text-red-400" }
                  ].map((tip, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 + 0.5 }}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                    >
                      <tip.icon className={`${tip.color} text-sm mt-0.5 flex-shrink-0`} />
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed">{tip.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOwnerDatingProfile;
