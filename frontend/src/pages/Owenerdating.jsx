import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiX, FiMessageCircle, FiPlus, FiChevronLeft, FiChevronRight, FiUser, FiMapPin } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllOwnerDatingProfiles, likeOwnerProfile, passOwnerProfile, getMyOwnerDatingProfile } from "../services/ownerDatingService";
import { getPetsByOwnerEmail } from "../services/petService";
import { navigateToChat } from "../services/chatService";
import { createMatch } from "../services/matchService";



const Owenerdating = () => {
  const { userInfo, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [ageRange, setAgeRange] = useState({ min: 18, max: 60 });
  const [genderPreference, setGenderPreference] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [matchPanelOpen, setMatchPanelOpen] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

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

  console.log('userProfile:', userProfile?._id);

  // Fetch profiles and pets on component mount

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
    // Skip own profile
    if (userProfile?._id === profile._id) return false;
    
    // Age filter
    if (profile.OwnerAge < ageRange.min || profile.OwnerAge > ageRange.max) return false;
    
    // Gender preference filter
    if (genderPreference && profile.gender !== genderPreference) return false;
    
    return true;
  });

  // Debug log to verify filtering
  useEffect(() => {
    console.log('Current user profile ID:', userProfile?._id);
    console.log('Filtered profiles:', filteredProfiles.map(p => p._id));
  }, [filteredProfiles, userProfile]);

  const handleSwipe = async (direction, profileId) => {
    setDirection(direction);
    
    try {
      if (direction === "right") {
        const result = await likeOwnerProfile(profileId);
        if (result.data.match) {
          // Store match data using createMatch service
          await createMatch(profileId, await currentUser.getIdToken());
          setMatchedProfile(currentProfile);
          setMatchPanelOpen(true);
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
        ) : (
          // Profile Cards Grid
          <div className="space-y-8">
            <AnimatePresence>
              {currentProfile && (
                <motion.div
                  key={currentProfile._id}
                  initial={{ opacity: 1 }}
                  animate={{ 
                    x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
                    opacity: direction ? 0 : 1,
                    rotateZ: direction === "left" ? -5 : direction === "right" ? 5 : 0
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-gold/20 max-w-4xl mx-auto"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                    {/* Profile Image Section */}
                    <div className="relative h-[400px] lg:h-full">
                      <img 
                        src={currentProfile.ProfilePicture} 
                        alt={currentProfile.user.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent"></div>
                      
                      {/* Profile Header Info */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
                          <h3 className="text-3xl font-bold text-white mb-2">
                            {currentProfile.user.name}, {currentProfile.OwnerAge}
                          </h3>
                          <div className="flex items-center gap-4 text-white/90">
                            <div className="flex items-center gap-1">
                              <FiMapPin className="text-gold" />
                              <span>{currentProfile.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiUser className="text-gold" />
                              <span className="capitalize">{currentProfile.gender}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Profile Details Section */}
                    <div className="p-8 flex flex-col">
                      {/* Bio */}
                      <div className="mb-6">
                        <h4 className="text-xl font-semibold text-gold mb-3">About</h4>
                        <p className="text-white/90 leading-relaxed line-clamp-3">
                          {currentProfile.bio}
                        </p>
                      </div>
                      
                      {/* Interests */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gold mb-3">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentProfile.interests?.slice(0, 6).map((interest, idx) => (
                            <span 
                              key={`interest-${idx}-${interest}`}
                              className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-medium"
                            >
                              {interest}
                            </span>
                          ))}
                          {currentProfile.interests?.length > 6 && (
                            <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm">
                              +{currentProfile.interests.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Hobbies */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gold mb-3">Hobbies</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentProfile.hobbies?.slice(0, 4).map((hobby, idx) => (
                            <span 
                              key={`hobby-${idx}-${hobby}`}
                              className="px-3 py-1 bg-white/10 text-white rounded-full text-sm"
                            >
                              {hobby}
                            </span>
                          ))}
                          {currentProfile.hobbies?.length > 4 && (
                            <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm">
                              +{currentProfile.hobbies.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Pets Preview */}
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gold mb-3">Pets</h4>
                        {Array.isArray(currentProfile.pets) && currentProfile.pets.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {currentProfile.pets.slice(0, 2).map((pet, idx) => (
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
                                  <p className="font-medium text-white">{pet.name}</p>
                                  <p className="text-sm text-white/70">{pet.breed}, {pet.age} yr</p>
                                </div>
                              </div>
                            ))}
                            {currentProfile.pets.length > 2 && (
                              <p className="text-sm text-white/60 text-center">
                                +{currentProfile.pets.length - 2} more pets
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-white/50 text-sm">No pets listed</p>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-auto space-y-4">
                        <button
                          onClick={() => navigate(`/view-owner-dating-profile/${currentProfile._id}`)}
                          className="w-full px-6 py-3 bg-gold/20 text-gold border border-gold/30 rounded-xl hover:bg-gold/30 transition-all duration-300 font-medium"
                        >
                          View Full Profile
                        </button>
                        
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSwipe("left", currentProfile._id)}
                            className="flex-1 py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <FiX /> Pass
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigateToChat(
                              navigate,
                              currentProfile.user.email.split('@')[0],
                              {
                                name: currentProfile.user.name,
                                picture: currentProfile.user.picture
                              }
                            )}
                            className="px-4 py-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center"
                          >
                            <FiMessageCircle />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSwipe("right", currentProfile._id)}
                            className="flex-1 py-3 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <FiHeart /> Like
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          
            
            {/* Match Panel */}
            {matchPanelOpen && matchedProfile && (
              <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-gold/20 to-purple-900/20 backdrop-blur-md rounded-3xl p-8 text-center max-w-md mx-4 border border-gold/30"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-3xl font-bold mb-2 text-gold">It's a Match!</h3>
                  <p className="text-white/80 mb-6">You and {matchedProfile.user.name} liked each other</p>
                  
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <img 
                      src={userProfile?.ProfilePicture || userInfo?.picture} 
                      alt="You" 
                      className="w-16 h-16 rounded-full border-2 border-gold"
                    />
                    <div className="text-2xl text-gold">💕</div>
                    <img 
                      src={matchedProfile.ProfilePicture} 
                      alt={matchedProfile.user.name} 
                      className="w-16 h-16 rounded-full border-2 border-gold"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setMatchPanelOpen(false)}
                      className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                    >
                      Keep Swiping
                    </button>
                    <button
                      onClick={() => {
                        setMatchPanelOpen(false);
                        navigateToChat(
                          navigate,
                          matchedProfile.user.email.split('@')[0],
                          {
                            name: matchedProfile.user.name,
                            picture: matchedProfile.user.picture
                          }
                        );
                      }}
                      className="flex-1 py-3 bg-gold text-navy rounded-xl hover:bg-accent-orange transition-all duration-300 font-medium"
                    >
                      Send Message
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
            
            {/* End of Profiles Message */}
            {isLastProfile && (
              <div className="fixed inset-0 flex items-center justify-center z-40 backdrop-blur-sm">
                <div className="bg-white/5 rounded-lg p-6 text-center max-w-sm mx-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">All caught up!</h3>
                  <p className="text-white/60 text-sm mb-4">No more profiles to show</p>
                  <button 
                    onClick={() => setCurrentIndex(0)}
                    className="px-4 py-2 bg-gold/80 text-navy rounded text-sm hover:bg-gold"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
    

      </section>
    </div>
  );
};

export default Owenerdating;