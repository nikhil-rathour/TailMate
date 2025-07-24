import React, { useState, useMemo } from "react";
import { UseLike } from "../../context/LikeContext";
import { deleteLike, getAllLikePosts } from "../../utils/like.utils";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiMapPin, FiCalendar, FiTag, FiEye, FiStar, FiSearch, FiFilter, FiX } from "react-icons/fi";

const LikeComponent = () => {
  const { likes, setLikes } = UseLike();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    breed: "",
    gender: "",
    ageRange: "",
    listingType: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleLike = async (id) => {
    setRemovingId(id);
    const res = await deleteLike(userInfo._id, id);
    res.success ? toast.success(res.message) : toast.error(res.message);
    console.log("post res", res);

    await getLikeData(userInfo._id);
    setRemovingId(null);
  };

  async function getLikeData(id) {
    const res = await getAllLikePosts(id);
    console.log(res);
    setLikes(res.data);
  }

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    if (!likes.length) return { breeds: [], genders: [] };
    
    const breeds = [...new Set(likes.map(like => like.postId.breed).filter(Boolean))].sort();
    const genders = [...new Set(likes.map(like => like.postId.gender).filter(Boolean))].sort();
    
    return { breeds, genders };
  }, [likes]);

  // Filtered likes based on search and filters
  const filteredLikes = useMemo(() => {
    return likes.filter(like => {
      const post = like.postId;
      
      // Search term filter (name and breed)
      const matchesSearch = searchTerm === "" || 
        post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.breed.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Breed filter
      const matchesBreed = filters.breed === "" || 
        post.breed.toLowerCase() === filters.breed.toLowerCase();
      
      // Gender filter
      const matchesGender = filters.gender === "" || 
        post.gender.toLowerCase() === filters.gender.toLowerCase();
      
      // Age range filter
      const matchesAge = filters.ageRange === "" || (() => {
        const age = parseInt(post.age);
        switch(filters.ageRange) {
          case "young": return age <= 2;
          case "adult": return age > 2 && age <= 7;
          case "senior": return age > 7;
          default: return true;
        }
      })();
      
      // Listing type filter
      const matchesListingType = filters.listingType === "" || 
        post.listingType === filters.listingType;
      
      return matchesSearch && matchesBreed && matchesGender && matchesAge && matchesListingType;
    });
  }, [likes, searchTerm, filters]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      breed: "",
      gender: "",
      ageRange: "",
      listingType: ""
    });
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || Object.values(filters).some(filter => filter !== "");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      x: -100,
      transition: {
        duration: 0.4
      }
    }
  };

  if (likes.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6"
      >
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-gold/20 to-accent-orange/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-gold/30">
            <FiHeart className="w-16 h-16 text-gold/60" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-gold to-accent-orange rounded-full flex items-center justify-center shadow-lg">
            <span className="text-navy text-sm font-bold">0</span>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-bold text-gold">No Favorites Yet</h3>
          <p className="text-white/60 max-w-md text-lg">
            Start exploring and heart the pets you love to see them here
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-gold to-accent-orange rounded-2xl shadow-lg">
              <FiHeart className="w-7 h-7 text-navy" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-navy rounded-full flex items-center justify-center border-2 border-gold">
              <span className="text-gold text-xs font-bold">{likes.length}</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gold">My Favorites</h2>
            <p className="text-white/60 text-lg">
              {filteredLikes.length} of {likes.length} beloved pets
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-white/50">
          <FiStar className="w-4 h-4" />
          <span className="text-sm">Premium Collection</span>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Search Bar and Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-gold/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
            />
          </div>
          
          {/* Filter Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-4 rounded-2xl border transition-all duration-300 ${
              showFilters || hasActiveFilters
                ? "bg-gold/20 border-gold/50 text-gold"
                : "bg-white/5 border-gold/20 text-white/70 hover:border-gold/40"
            }`}
          >
            <FiFilter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-accent-orange rounded-full" />
            )}
          </motion.button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-gold/20 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gold">Filter Options</h3>
                  {hasActiveFilters && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 hover:bg-red-500/30 transition-all duration-300"
                    >
                      <FiX className="w-4 h-4" />
                      <span className="text-sm">Clear All</span>
                    </motion.button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Breed Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Breed</label>
                    <select
                      value={filters.breed}
                      onChange={(e) => setFilters(prev => ({ ...prev, breed: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                    >
                      <option value="">All Breeds</option>
                      {filterOptions.breeds.map(breed => (
                        <option key={breed} value={breed} className="bg-navy text-white">
                          {breed}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Gender Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Gender</label>
                    <select
                      value={filters.gender}
                      onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                    >
                      <option value="">All Genders</option>
                      {filterOptions.genders.map(gender => (
                        <option key={gender} value={gender} className="bg-navy text-white">
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Age Range Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Age Range</label>
                    <select
                      value={filters.ageRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                    >
                      <option value="">All Ages</option>
                      <option value="young" className="bg-navy text-white">Young (0-2 years)</option>
                      <option value="adult" className="bg-navy text-white">Adult (3-7 years)</option>
                      <option value="senior" className="bg-navy text-white">Senior (8+ years)</option>
                    </select>
                  </div>

                  {/* Listing Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Listing Type</label>
                    <select
                      value={filters.listingType}
                      onChange={(e) => setFilters(prev => ({ ...prev, listingType: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-xl text-white focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                    >
                      <option value="">All Types</option>
                      <option value="adoption" className="bg-navy text-white">Adoption</option>
                      <option value="sale" className="bg-navy text-white">For Sale</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {searchTerm && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-gold/20 border border-gold/30 rounded-xl text-gold text-sm">
                <span>Search: "{searchTerm}"</span>
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-gold/20 rounded p-1 transition-colors duration-200"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            )}
            {Object.entries(filters).map(([key, value]) => 
              value && (
                <div key={key} className="flex items-center space-x-2 px-3 py-2 bg-accent-orange/20 border border-accent-orange/30 rounded-xl text-accent-orange text-sm">
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, [key]: "" }))}
                    className="hover:bg-accent-orange/20 rounded p-1 transition-colors duration-200"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              )
            )}
          </motion.div>
        )}
      </motion.div>

      {/* No Results Message */}
      {filteredLikes.length === 0 && likes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 space-y-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-accent-orange/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
            <FiSearch className="w-8 h-8 text-gold/60" />
          </div>
          <h3 className="text-xl font-semibold text-gold">No pets match your filters</h3>
          <p className="text-white/60 max-w-md mx-auto">
            Try adjusting your search criteria or clearing some filters to see more results
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-gradient-to-r from-gold to-accent-orange text-navy font-semibold rounded-xl hover:from-accent-orange hover:to-gold transition-all duration-300"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Enhanced Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredLikes.map((like) => {
            console.log("like", like);
            const post = like.postId;
            const isRemoving = removingId === post._id;
            const isNew = new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            
            return (
              <motion.div
                key={post._id}
                layout
                variants={itemVariants}
                exit="exit"
                className="group relative"
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-gold/20 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-700 shadow-xl">
                  
                  {/* Enhanced Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      src={post.img}
                      alt={post.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-pet.jpg";
                      }}
                    />
                    
                    {/* Premium Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60" />
                    
                    {/* Enhanced New Badge */}
                    <AnimatePresence>
                      {isNew && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0, rotate: -10 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute top-4 right-4 bg-gradient-to-r from-gold to-accent-orange text-navy text-xs font-bold px-4 py-2 rounded-full z-10 shadow-lg border border-gold/30"
                        >
                          ✨ New
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Premium Like Button */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 left-4 z-10"
                    >
                      <div 
                        onClick={() => handleLike(post._id)}
                        className="p-3 bg-black/30 backdrop-blur-md rounded-full border border-white/20 hover:bg-red-500/20 transition-all duration-300 cursor-pointer group/heart"
                      >
                        <motion.div
                          animate={isRemoving ? { 
                            rotate: [0, 15, -15, 0],
                            scale: [1, 1.2, 1]
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          <FiHeart className="w-5 h-5 text-red-500 fill-current group-hover/heart:text-red-400 transition-colors duration-200" />
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Enhanced Price Display */}
                    {post.listingType === "sale" && post.price && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 right-4 z-10"
                      >
                        <div className="bg-gradient-to-r from-gold to-accent-orange text-navy font-bold px-4 py-2 rounded-full shadow-lg border border-gold/30">
                          ${post.price}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Enhanced Content Section */}
                  <div className="p-6 space-y-4">
                    {/* Title Section */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-2xl text-gold group-hover:text-accent-orange transition-colors duration-300">
                        {post.name}
                      </h3>
                      <p className="text-white/70 text-sm font-medium tracking-wide">{post.breed}</p>
                    </div>

                    {/* Enhanced Details Grid */}
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-white/80">
                          <div className="w-2 h-2 bg-gold rounded-full" />
                          <span className="font-medium">{post.gender}, {post.age} years</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/60">
                          <FiMapPin className="w-4 h-4" />
                          <span className="truncate">{post.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Meta Information */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center space-x-2 text-xs text-white/50">
                        <FiCalendar className="w-3.5 h-3.5" />
                        <span>Added: {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiTag className="w-3.5 h-3.5 text-white/40" />
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                          post.listingType === "adoption"
                            ? "bg-green-500/15 text-green-300 border-green-500/30"
                            : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                        }`}>
                          {post.listingType === "adoption" ? "Adoption" : "For Sale"}
                        </span>
                      </div>
                    </div>

                    {/* Premium Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/view-pet/${post._id}`)}
                      className="w-full bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy py-4 px-6 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl group/btn border border-gold/20"
                    >
                      <FiEye className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                      <span className="text-lg">
                        {post.listingType === "adoption" ? "Adopt Me!" : "View Details"}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LikeComponent;