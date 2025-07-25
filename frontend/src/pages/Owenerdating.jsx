import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiX, FiMessageCircle, FiPlus, FiChevronLeft, FiChevronRight, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllOwnerDatingProfiles, likeOwnerProfile, passOwnerProfile, getMyOwnerDatingProfile } from "../services/ownerDatingService";
import { getPetsByOwnerEmail } from "../services/petService";



const Owenerdating = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('swipe'); // 'swipe' or 'grid'
  
  // Filter states
  const [ageRange, setAgeRange] = useState({ min: 18, max: 60 });
  const [genderPreference, setGenderPreference] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  // console.log(userProfile?._id);

  // Swipe direction state
  const [direction, setDirection] = useState(null);

  // Check if user has dating profile and set gender preference
  useEffect(() => {
    const checkUserProfile = async () => {
      if (userInfo) {
        try {
          const profile = await getMyOwnerDatingProfile();
          setUserProfile(profile.data);
        } catch (error) {
          setUserProfile(null);
        }
        
        if (userInfo?.gender) {
          const oppositeGender = userInfo.gender === 'Male' ? 'Female' : 'Male';
          setGenderPreference(oppositeGender);
        }
      }
    };
    checkUserProfile();
  }, [userInfo]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        // Fetch owner dating profiles
        const profilesResponse = await getAllOwnerDatingProfiles();
        console.log('Full response:', profilesResponse);
        const profilesData = profilesResponse.data?.profiles || profilesResponse.profiles || [];
        console.log('Profiles data:', profilesData);


        // Fetch pets for each profile owner
        const profilesWithPets = await Promise.all(
          profilesData.map(async (profile) => {
            try {
              const petsResponse = await getPetsByOwnerEmail(profile.user.email);
              const petsData = petsResponse.data || [];
              
              // Map pet data to match frontend expectations
              const mappedPets = Array.isArray(petsData) ? petsData.map(pet => ({
                ...pet,
                image: pet.img, // Map img field to image
                name: pet.name,
                breed: pet.breed,
                age: pet.age
              })) : [];
              
              return {
                ...profile,
                pets: mappedPets
              };
            } catch (error) {
              console.error(`Error fetching pets for ${profile.user.email}:`, error);
              return {
                ...profile,
                pets: []
              };
            }
          })
        );
        
        setProfiles(profilesWithPets);
        setLoading(false);
        
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
        setError("Failed to load profiles. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Apply filters to profiles
  const filteredProfiles = profiles.filter(profile => {
    // Age filter
    if (profile.OwnerAge < ageRange.min || profile.OwnerAge > ageRange.max) return false;
    
    // Gender preference filter
    if (genderPreference && profile.gender !== genderPreference) return false;
    
    return true;
  });

  const handleSwipe = async (direction, profileId) => {
    setDirection(direction);
    
    try {
      if (direction === "right") {
        const result = await likeOwnerProfile(profileId);
        if (result.data.match) {
          alert("It's a match! 🎉");
        }
      } else if (direction === "left") {
        await passOwnerProfile(profileId);
      }
    } catch (error) {
      console.error('Error handling swipe:', error);
    }
    
    // Wait for animation to complete before changing index
    setTimeout(() => {
      setCurrentIndex(prevIndex => 
        prevIndex < filteredProfiles.length - 1 ? prevIndex + 1 : prevIndex
      );
      setDirection(null);
    }, 300);
  };



  const currentProfile = filteredProfiles[currentIndex];
  const isLastProfile = currentIndex === filteredProfiles.length - 1;


  return (
    <div className="bg-navy min-h-screen text-white pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-purple-900 to-navy py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg"
          >
            Owner Dating
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 text-gold font-medium drop-shadow max-w-3xl mx-auto"
          >
            Connect with other pet owners who share your love for animals. Find your perfect match!
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(userProfile ? `/view-owner-dating-profile/${userProfile._id}` : '/create-owner-dating-profile')}
            className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform flex items-center gap-2 mx-auto"
          >
            {userProfile ? <FiUser /> : <FiPlus />} {userProfile ? 'View Your Dating Profile' : 'Create Dating Profile'}
          </motion.button>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold">Find Your Match</h2>
          <div className="flex items-center gap-4">
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('swipe')}
                className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
                  viewMode === 'swipe' ? 'bg-gold text-navy' : 'text-white hover:bg-white/10'
                }`}
              >
                Swipe
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-gold text-navy' : 'text-white hover:bg-white/10'
                }`}
              >
                Grid
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Filters
            </button>
          </div>
        </div>


        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gold">Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2">Age Range</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={ageRange.min}
                    onChange={(e) => setAgeRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    min="18"
                    max="100"
                  />
                  <span className="text-white">to</span>
                  <input
                    type="number"
                    value={ageRange.max}
                    onChange={(e) => setAgeRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    min="18"
                    max="100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white mb-2">Gender Preference</label>
                <select
                  value={genderPreference}
                  onChange={(e) => setGenderPreference(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setAgeRange({ min: 18, max: 60 });
                  const oppositeGender = userInfo?.gender === 'Male' ? 'Female' : 'Male';
                  setGenderPreference(oppositeGender);
                }}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-gold text-navy rounded-lg hover:bg-accent-orange transition-all duration-300"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Content based on view mode */}
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="relative">
              <div className="w-16 h-16 border-t-4 border-b-4 border-gold rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-r-4 border-l-4 border-gold/30 rounded-full animate-spin absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 text-white px-6 py-4 rounded-xl mb-6 text-center">
            <p className="text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
            <p className="text-white/70 mb-6">No profiles available at the moment.</p>
          </div>
        ) : viewMode === 'swipe' ? (
          // Swipe Mode
          <div className="relative h-[60vh] max-h-[700px]">
            <AnimatePresence>
              {currentProfile && (
                <motion.div
                  key={currentProfile._id}
                  initial={{ opacity: 1 }}
                  animate={{ 
                    x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
                    opacity: direction ? 0 : 1,
                    rotateZ: direction === "left" ? -10 : direction === "right" ? 10 : 0
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-gold/20"
                >
                  <div className="relative h-full flex flex-col">
                    {/* Profile Image */}
                    <div className="h-1/2 relative">
                      <img 
                        src={currentProfile.ProfilePicture} 
                        alt={currentProfile.user.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white">{currentProfile.user.name}, {currentProfile.OwnerAge}</h3>
                        <p className="text-white/80">{currentProfile.location}</p>
                      </div>
                    </div>
                    
                    {/* Profile Info */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      <p className="text-white/90 mb-4">{currentProfile.bio}</p>
                      
                      <h4 className="text-gold font-semibold mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {currentProfile.interests?.map((interest, idx) => (
                          <span 
                            key={`interest-${idx}-${interest}`}
                            className="px-3 py-1 bg-white/10 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                      
                      <h4 className="text-gold font-semibold mb-2">Hobbies</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {currentProfile.hobbies?.map((hobby, idx) => (
                          <span 
                            key={`hobby-${idx}-${hobby}`}
                            className="px-3 py-1 bg-white/5 rounded-full text-sm"
                          >
                            {hobby}
                          </span>
                        ))}
                      </div>
                      
                      <h4 className="text-gold font-semibold mb-2">Pets</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.isArray(currentProfile.pets) && currentProfile.pets.length > 0 ? (
                          currentProfile.pets.map((pet, idx) => (
                            <div key={`pet-${idx}-${pet.name || idx}`} className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                              <img 
                                src={pet.image || '/default-pet.png'}
                                alt={pet.name}
                                className="w-12 h-12 rounded-full object-cover border border-white/20"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/48x48/4A5568/FFFFFF?text=Pet';
                                }}
                              />
                              <div>
                                <p className="font-medium">{pet.name}</p>
                                <p className="text-sm text-white/70">{pet.breed}, {pet.age} yr</p>
                                <p className="text-xs text-white/50 capitalize">{pet.type}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-4">
                            <p className="text-white/50 text-sm">No pets listed</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Action Buttons */}
            {!isLastProfile && currentProfile && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSwipe("left", currentProfile._id)}
                  className="w-16 h-16 flex items-center justify-center bg-red-500 rounded-full shadow-lg"
                >
                  <FiX className="text-white text-2xl" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(`/chat/${currentProfile._id}`)}
                  className="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-full shadow-lg"
                >
                  <FiMessageCircle className="text-white text-xl" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSwipe("right", currentProfile._id)}
                  className="w-16 h-16 flex items-center justify-center bg-green-500 rounded-full shadow-lg"
                >
                  <FiHeart className="text-white text-2xl" />
                </motion.button>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 z-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full disabled:opacity-30"
              >
                <FiChevronLeft className="text-white" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentIndex(prev => Math.min(filteredProfiles.length - 1, prev + 1))}
                disabled={isLastProfile}
                className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full disabled:opacity-30"
              >
                <FiChevronRight className="text-white" />
              </motion.button>
            </div>
            
            {/* Profile Counter */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm">
                {currentIndex + 1} / {filteredProfiles.length}
              </div>
            </div>
            
            {/* End of Profiles Message */}
            {isLastProfile && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy/80 backdrop-blur-sm rounded-3xl">
                <div className="text-center p-6">
                  <h3 className="text-2xl font-bold mb-2">You've seen all profiles!</h3>
                  <p className="text-white/70 mb-6">Check back later for more matches or adjust your filters.</p>
                  <button 
                    onClick={() => setCurrentIndex(0)}
                    className="px-6 py-3 bg-gold text-navy rounded-lg hover:bg-accent-orange transition-all duration-300"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Grid Mode
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile, profileIndex) => (
              <motion.div
                key={`profile-${profile._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: profileIndex * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gold/20 hover:border-gold/40 transition-all duration-300"
              >
                {/* Profile Image */}
                <div className="h-64 relative">
                  <img 
                    src={profile.ProfilePicture} 
                    alt={profile.user.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{profile.user.name}, {profile.OwnerAge}</h3>
                    <p className="text-white/80 text-sm">{profile.location}</p>
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="p-4">
                  <p className="text-white/90 text-sm mb-3 line-clamp-2">{profile.bio}</p>
                  
                  <div className="mb-3">
                    <h4 className="text-gold font-semibold text-sm mb-1">Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.interests?.slice(0, 3).map((interest, interestIdx) => (
                        <span 
                          key={`grid-interest-${profileIndex}-${interestIdx}-${interest}`}
                          className="px-2 py-1 bg-white/10 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                      {profile.interests?.length > 3 && (
                        <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/60">
                          +{profile.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-gold font-semibold text-sm mb-1">Hobbies</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.hobbies?.slice(0, 2).map((hobby, hobbyIdx) => (
                        <span 
                          key={`grid-hobby-${profileIndex}-${hobbyIdx}-${hobby}`}
                          className="px-2 py-1 bg-white/5 rounded-full text-xs"
                        >
                          {hobby}
                        </span>
                      ))}
                      {profile.hobbies?.length > 2 && (
                        <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/60">
                          +{profile.hobbies.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => passOwnerProfile(profile._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                    >
                      <FiX className="text-sm" />
                      <span className="text-sm">Pass</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/chat/${profile._id}`)}
                      className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
                    >
                      <FiMessageCircle className="text-sm" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={async () => {
                        try {
                          const result = await likeOwnerProfile(profile._id);
                          if (result.data.match) {
                            alert("It's a match! 🎉");
                          }
                        } catch (error) {
                          console.error('Error liking profile:', error);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all duration-300"
                    >
                      <FiHeart className="text-sm" />
                      <span className="text-sm">Like</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Owenerdating;