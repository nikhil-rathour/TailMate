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
    <div className="bg-navy min-h-screen text-white">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-50 bg-navy/90 backdrop-blur-md border-b border-gold/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/owner-dating")}
              className="flex items-center gap-2 text-gold hover:text-accent-orange transition-all duration-300 font-semibold bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full"
            >
              <FiArrowLeft className="text-lg" /> 
              <span className="hidden sm:inline">Back to Dating</span>
              <span className="sm:hidden">Back</span>
            </motion.button>
            
            <div className="flex-1 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg sm:text-xl lg:text-2xl font-bold text-gold truncate px-4"
              >
                {isOwner ? 'My Dating Profile' : `${profile?.user.name}'s Profile`}
              </motion.h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {/* Main Profile Section */}
          <div className="xl:col-span-3 lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Enhanced Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl lg:rounded-3xl overflow-hidden border border-gold/20 shadow-2xl hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-500"
            >
              <div className="h-56 sm:h-72 md:h-80 lg:h-96 relative group overflow-hidden">
                <motion.img
                  src={profile.ProfilePicture}
                  alt={profile.user.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  whileHover={{ scale: 1.05 }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/30 to-transparent group-hover:from-navy/80 transition-all duration-500"></div>
                
                {/* Status Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold backdrop-blur-md border-2 ${
                      profile.isActive
                        ? "bg-green-500/40 text-green-100 border-green-400/60 shadow-green-500/30"
                        : "bg-red-500/40 text-red-100 border-red-400/60 shadow-red-500/30"
                    } shadow-xl`}
                  >
                    <motion.div 
                      animate={profile.isActive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`inline-block w-2 h-2 rounded-full mr-1.5 sm:mr-2 ${
                        profile.isActive ? 'bg-green-300' : 'bg-red-300'
                      }`}
                    ></motion.div>
                    {profile.isActive ? "Active" : "Paused"}
                  </motion.span>
                </motion.div>
                
                {/* Profile Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <motion.h2 
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      {profile.user.name}, {profile.OwnerAge}
                    </motion.h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/90">
                      <motion.div 
                        className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiMapPin className="text-gold text-xs sm:text-sm" />
                        <span className="text-xs sm:text-sm font-semibold">{profile.location}</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiUser className="text-gold text-xs sm:text-sm" />
                        <span className="text-xs sm:text-sm font-semibold capitalize">{profile.gender}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Quick Actions Overlay - Only for visitors */}
                {!isOwner && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 sm:p-2.5 rounded-full backdrop-blur-md border-2 transition-all duration-300 shadow-lg ${
                        isLiked 
                          ? 'bg-red-500/40 text-red-100 border-red-400/60 shadow-red-500/30' 
                          : 'bg-white/20 text-white/80 border-white/30 hover:bg-red-500/30 hover:text-red-200 hover:border-red-400/50'
                      }`}
                    >
                      <motion.div
                        animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <FiHeart className={`text-base sm:text-lg ${isLiked ? 'fill-current' : ''}`} />
                      </motion.div>
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
              whileHover={{ y: -2, scale: 1.01 }}
              className="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/20 hover:border-gold/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <motion.h3 
                  className="text-lg sm:text-xl font-bold text-gold flex items-center gap-2"
                  whileHover={{ x: 2 }}
                >
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiUser className="text-gold" />
                  </motion.div>
                  About Me
                </motion.h3>
                {profile.bio && profile.bio.length > 150 && (
                  <motion.button
                    whileHover={{ scale: 1.05, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="text-gold/80 hover:text-gold text-sm font-semibold bg-gold/10 hover:bg-gold/20 px-3 py-1 rounded-full transition-all duration-300"
                  >
                    {showFullBio ? 'Show Less' : 'Read More'}
                  </motion.button>
                )}
              </div>
              <motion.div
                layout
                className="text-white/90 leading-relaxed text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.p 
                  className={`${!showFullBio && profile.bio?.length > 150 ? 'line-clamp-3' : ''}`}
                  layout
                >
                  {profile.bio || (
                    <span className="text-white/60 italic">
                      {isOwner ? 'Add a bio to tell others about yourself!' : 'No bio available'}
                    </span>
                  )}
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Enhanced Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/20 hover:border-gold/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-500"
            >
              <motion.h3 
                className="text-lg sm:text-xl font-bold text-gold mb-4 sm:mb-6 flex items-center gap-2"
                whileHover={{ x: 2 }}
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiTrendingUp className="text-gold" />
                </motion.div>
                Details
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <motion.div 
                  className="bg-white/10 rounded-lg p-3 sm:p-4 hover:bg-white/20 border border-white/10 hover:border-gold/30 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-gold/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Occupation</p>
                  <p className="text-white font-bold text-sm sm:text-base">
                    {profile.occupation || (
                      <span className="text-white/60 italic">Not specified</span>
                    )}
                  </p>
                </motion.div>
                <motion.div 
                  className="bg-white/10 rounded-lg p-3 sm:p-4 hover:bg-white/20 border border-white/10 hover:border-gold/30 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-gold/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Education</p>
                  <p className="text-white font-bold text-sm sm:text-base">
                    {profile.education || (
                      <span className="text-white/60 italic">Not specified</span>
                    )}
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
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/20 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-purple-400/30 hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-500 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="p-2 sm:p-3 bg-purple-500/30 rounded-full border border-purple-400/40"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiActivity className="text-purple-300 text-lg sm:text-xl" />
                  </motion.div>
                  <motion.h3 
                    className="text-lg sm:text-xl font-bold text-purple-200"
                    whileHover={{ x: 2 }}
                  >
                    Compatibility Score
                  </motion.h3>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 sm:p-4">
                    <span className="text-white/90 font-semibold text-sm sm:text-base">Match Percentage</span>
                    <motion.span 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      className="text-2xl sm:text-3xl font-bold text-purple-200"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {compatibility}%
                    </motion.span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-white/20 rounded-full h-4 sm:h-5 overflow-hidden border border-white/30">
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: `${compatibility}%`, opacity: 1 }}
                        transition={{ duration: 2, delay: 0.7, ease: "easeOut" }}
                        className={`h-full rounded-full relative shadow-lg ${
                          compatibility >= 80 ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 shadow-green-500/50' :
                          compatibility >= 60 ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 shadow-yellow-500/50' :
                          compatibility >= 40 ? 'bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 shadow-orange-500/50' :
                          'bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-red-500/50'
                        }`}
                      >
                        <motion.div
                          animate={{ x: [-15, 15, -15] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 bg-white/30 rounded-full"
                        />
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="absolute -top-8 left-0 right-0 text-center"
                    >
                      <span className="text-xs text-white/60 font-medium">
                        {compatibility >= 80 ? '🔥 Excellent' :
                         compatibility >= 60 ? '✨ Good' :
                         compatibility >= 40 ? '💫 Fair' :
                         '🌟 Different'}
                      </span>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 150 }}
                    whileHover={{ scale: 1.02 }}
                    className={`text-center p-3 sm:p-4 rounded-xl backdrop-blur-sm ${
                      compatibility >= 80 ? 'bg-green-500/20 border-2 border-green-400/40 shadow-green-500/20' :
                      compatibility >= 60 ? 'bg-yellow-500/20 border-2 border-yellow-400/40 shadow-yellow-500/20' :
                      compatibility >= 40 ? 'bg-orange-500/20 border-2 border-orange-400/40 shadow-orange-500/20' :
                      'bg-red-500/20 border-2 border-red-400/40 shadow-red-500/20'
                    } shadow-lg`}
                  >
                    <motion.p 
                      className="text-sm sm:text-base text-white/90 font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      {compatibility >= 80 ? '🔥 Excellent match! You have a lot in common.' :
                       compatibility >= 60 ? '✨ Good compatibility! Worth getting to know.' :
                       compatibility >= 40 ? '💫 Some common ground to explore.' :
                       '🌟 Different interests can be exciting too!'}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Interests & Hobbies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: !isOwner && myProfile ? 0.4 : 0.3 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/20 hover:border-gold/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-500"
            >
              <div className="space-y-6 sm:space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.h3 
                    className="text-lg sm:text-xl font-bold text-gold mb-4 sm:mb-6 flex items-center gap-2"
                    whileHover={{ x: 2 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 180, scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiStar className="text-gold" />
                    </motion.div>
                    Interests
                  </motion.h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {profile.interests?.length > 0 ? profile.interests.map((interest, idx) => {
                      const isCommon = !isOwner && myProfile?.interests?.includes(interest);
                      return (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
                          whileHover={{ scale: 1.08, y: -3, rotate: 2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 border-2 ${
                            isCommon 
                              ? 'bg-green-500/30 text-green-200 border-green-400/60 shadow-green-500/30 shadow-lg' 
                              : 'bg-gold/20 text-gold hover:bg-gold/30 border-gold/40 hover:border-gold/60 hover:shadow-gold/20 hover:shadow-lg'
                          }`}
                        >
                          {interest} {isCommon && (
                            <motion.span
                              animate={{ rotate: [0, 15, -15, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              ✨
                            </motion.span>
                          )}
                        </motion.span>
                      );
                    }) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/60 italic text-sm"
                      >
                        {isOwner ? 'Add interests to your profile!' : 'No interests listed'}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.h3 
                    className="text-lg sm:text-xl font-bold text-gold mb-4 sm:mb-6 flex items-center gap-2"
                    whileHover={{ x: 2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FiActivity className="text-gold" />
                    </motion.div>
                    Hobbies
                  </motion.h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {profile.hobbies?.length > 0 ? profile.hobbies.map((hobby, idx) => {
                      const isCommon = !isOwner && myProfile?.hobbies?.includes(hobby);
                      return (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                          whileHover={{ scale: 1.08, y: -3, rotate: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 border-2 ${
                            isCommon 
                              ? 'bg-green-500/30 text-green-200 border-green-400/60 shadow-green-500/30 shadow-lg' 
                              : 'bg-white/15 text-white hover:bg-white/25 border-white/30 hover:border-white/50 hover:shadow-white/10 hover:shadow-lg'
                          }`}
                        >
                          {hobby} {isCommon && (
                            <motion.span
                              animate={{ rotate: [0, -15, 15, 0] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            >
                              ✨
                            </motion.span>
                          )}
                        </motion.span>
                      );
                    }) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/60 italic text-sm"
                      >
                        {isOwner ? 'Add hobbies to your profile!' : 'No hobbies listed'}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Pets Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: !isOwner && myProfile ? 0.5 : 0.4 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/20 hover:border-gold/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-500"
            >
              <motion.h3 
                className="text-lg sm:text-xl font-bold text-gold mb-4 sm:mb-6 flex items-center gap-2"
                whileHover={{ x: 2 }}
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiCamera className="text-gold" />
                </motion.div>
                {isOwner ? 'My Pets' : `${profile.user.name}'s Pets`}
              </motion.h3>
              {profile.pets?.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4"
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
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 + 0.3, type: "spring", stiffness: 150 }}
                      whileHover={{ scale: 1.03, y: -3, rotate: 1 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all duration-300 cursor-pointer border border-white/20 hover:border-gold/40 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] group"
                    >
                      <div className="relative flex-shrink-0">
                        <motion.img
                          src={
                            pet.image ||
                            "https://via.placeholder.com/64x64/4A5568/FFFFFF?text=Pet"
                          }
                          alt={pet.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-gold/40 shadow-lg group-hover:border-gold/60 transition-all duration-300"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/64x64/4A5568/FFFFFF?text=Pet";
                          }}
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          loading="lazy"
                        />
                        <motion.div 
                          className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-navy flex items-center justify-center shadow-lg"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                        </motion.div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <motion.p 
                            className="font-bold text-white text-sm sm:text-base truncate group-hover:text-gold transition-colors duration-300"
                            whileHover={{ x: 2 }}
                          >
                            {pet.name}
                          </motion.p>
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`text-xs font-bold px-2 py-1 rounded-full shadow-md ${
                              pet.isDating
                                ? "bg-gradient-to-r from-pink-500 to-red-400 text-white shadow-pink-500/30"
                                : pet.listingType === "adoption"
                                ? "bg-green-500/90 text-white shadow-green-500/30"
                                : "bg-blue-500/90 text-white shadow-blue-500/30"
                            }`}
                          >
                            {pet.isDating ? "Dating" : pet.listingType === "adoption" ? "Adoption" : "Sale"}
                          </motion.span>
                        </div>
                        <motion.p 
                          className="text-white/80 text-xs sm:text-sm truncate font-medium mb-1"
                          whileHover={{ x: 2 }}
                        >
                          {pet.breed}
                        </motion.p>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <motion.span whileHover={{ scale: 1.05 }}>
                            {pet.age} weeks old
                          </motion.span>
                          <span className="text-white/40">•</span>
                          <motion.span 
                            className="capitalize"
                            whileHover={{ scale: 1.05 }}
                          >
                            {pet.type}
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center py-8 sm:py-12"
                >
                  <motion.div 
                    className="mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <FiCamera className="mx-auto text-4xl sm:text-5xl text-white/40 mb-3" />
                    </motion.div>
                    <p className="text-white/60 mb-4 text-sm sm:text-base font-medium">
                      {isOwner ? 'No pets added yet' : 'No pets listed'}
                    </p>
                  </motion.div>
                  {isOwner && (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/add-pet")}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy rounded-full font-bold shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-300"
                    >
                      Add Your First Pet
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Enhanced Sidebar */}
          <motion.div 
            className="xl:col-span-1 space-y-4 lg:space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Enhanced Profile Stats - Only for owner */}
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gold/20 hover:border-gold/40 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-500"
              >
                <motion.h3 
                  className="text-lg sm:text-xl font-bold text-gold mb-4 sm:mb-6 flex items-center gap-2"
                  whileHover={{ x: 2 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <FiStar className="text-gold" />
                  </motion.div>
                  Profile Stats
                </motion.h3>

                <div className="space-y-3 sm:space-y-4">
                  <motion.div 
                    className="flex items-center justify-between p-3 sm:p-4 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="p-2 bg-blue-500/30 rounded-full group-hover:bg-blue-500/40 transition-colors"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                      >
                        <FiEye className="text-blue-300 text-sm" />
                      </motion.div>
                      <span className="text-white/90 font-semibold text-sm sm:text-base">Profile Views</span>
                    </div>
                    <motion.span 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.1 }}
                      className="text-xl sm:text-2xl font-bold text-blue-300"
                    >
                      {stats.views}
                    </motion.span>
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-between p-3 sm:p-4 bg-red-500/20 rounded-xl hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="p-2 bg-red-500/30 rounded-full group-hover:bg-red-500/40 transition-colors"
                        whileHover={{ scale: 1.2 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FiHeart className="text-red-300 text-sm" />
                      </motion.div>
                      <span className="text-white/90 font-semibold text-sm sm:text-base">Likes Received</span>
                    </div>
                    <motion.span 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.1 }}
                      className="text-xl sm:text-2xl font-bold text-red-300"
                    >
                      {stats.likes}
                    </motion.span>
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-between p-3 sm:p-4 bg-green-500/20 rounded-xl hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="p-2 bg-green-500/30 rounded-full group-hover:bg-green-500/40 transition-colors"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                      >
                        <FiMessageCircle className="text-green-300 text-sm" />
                      </motion.div>
                      <span className="text-white/90 font-semibold text-sm sm:text-base">Matches</span>
                    </div>
                    <motion.span 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.1 }}
                      className="text-xl sm:text-2xl font-bold text-green-300"
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewOwnerDatingProfile;
