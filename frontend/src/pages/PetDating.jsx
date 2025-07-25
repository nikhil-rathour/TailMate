import React, { useState, useEffect } from "react";
import { getAllDatingPets } from "../services/petDatingService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiHeart  ,FiPlus} from "react-icons/fi";
import PetDatingVideo from "../videos/PetDatingSection";

const petTypes = [
  { label: "All Pets", value: "all" },
  { label: "Dogs", value: "dog" },
  { label: "Cats", value: "cat" },
  { label: "Birds", value: "bird" },
  { label: "Small Animals", value: "small" },
];

const PetDating = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");
  const [breed, setBreed] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const petsPerPage = 8;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Fetch dating pets from API
  useEffect(() => {
    const fetchDatingPets = async () => {
      try {
        setLoading(true);
        const filters = {
          type: selectedType !== "all" ? selectedType : undefined,
          breed: breed || undefined,
        };

        const response = await getAllDatingPets(filters);
        // Filter pets where isDating is true
        const datingPets = response.data.filter(pet => pet.isDating === true);
        setPets(datingPets || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dating pets:", err);
        setError("Failed to load dating pets. Please try again later.");
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDatingPets();
  }, [selectedType, breed]);

  // Sorting logic
  const sortedPets = [...pets].sort((a, b) => {
    if (sort === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedPets.length / petsPerPage);
  const paginatedPets = sortedPets.slice(
    (page - 1) * petsPerPage,
    page * petsPerPage
  );

  // Handlers
  const handleTypeChange = (value) => {
    setSelectedType(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedType("all");
    setBreed("");
    setPage(1);
    setSort("recent");
  };

  return (
    <div className="bg-navy min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative bg-navy h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg"
          >
            Pet Dating
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 text-gold font-medium drop-shadow max-w-3xl"
          >
            Find the perfect match for your furry friend. Browse through pets looking for companionship.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >

             <button 
                          onClick={() => navigate("/create-dating-pet")}
                          className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105 flex items-center gap-2"
                        >
                          <FiPlus /> Add New Pet
                        </button>
            <button 
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FiHeart /> View Favorites
            </button>
          </motion.div>
        </div>
        <PetDatingVideo/>
        <div className="absolute right-0 bottom-0 w-full h-full bg-gradient-to-b from-navy/50 to-navy opacity-80 z-0" />
      </section>

      {/* Filters Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-gold/20 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gold">Filter Dating Pets</h2>
              <div className="flex flex-wrap gap-2">
                {/* Pet Type Buttons */}
                {petTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedType === type.value
                        ? "bg-gold text-navy shadow-md"
                        : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                    }`}
                    onClick={() => handleTypeChange(type.value)}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Clear Filters Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all duration-300 border border-red-500/30"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </motion.button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6">
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
              <FiSearch className="text-gold mr-2" />
              <input
                type="text"
                placeholder="Search by breed..."
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-lg hover:bg-gold/30 transition-all duration-300"
              >
                <FiFilter className="text-gold" /> 
                <span>Sort</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Pet Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="relative">
              <div className="w-16 h-16 border-t-4 border-b-4 border-gold rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-r-4 border-l-4 border-gold/30 rounded-full animate-spin absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto text-center"
          >
            {error}
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {paginatedPets.length > 0 ? (
              paginatedPets.map((pet) => (
                <motion.div
                  key={pet._id}
                  variants={itemVariants}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500 group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={pet.img}
                      alt={pet.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-pet.jpg';
                      }}
                    />
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-red-400 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      Dating
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gold">{pet.name}</h3>
                    <p className="text-white/80 text-sm mb-1">{pet.breed}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70">{pet.gender}, {pet.age} weeks old</span>
                      <span className="text-white/60 text-sm">{pet.location}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white/60 text-xs">Added: {new Date(pet.createdAt).toLocaleDateString()}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/view-dating-pet/${pet._id}`)}
                      className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-red-400 hover:to-pink-500 text-white py-3 px-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      View Profile
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <p className="text-xl text-white/70 mb-4">No dating pets found matching your criteria.</p>
                <p className="text-white/50 mb-6">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={handleClearFilters}
                  className="bg-gold text-navy px-6 py-2 rounded-full font-medium hover:bg-accent-orange transition-all duration-300"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && paginatedPets.length > 0 && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white disabled:opacity-50 disabled:hover:bg-white/10 transition-all duration-300"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &lt; Previous
            </motion.button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    page === idx + 1
                      ? "bg-gold text-navy"
                      : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                  }`}
                  onClick={() => setPage(idx + 1)}
                >
                  {idx + 1}
                </motion.button>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white disabled:opacity-50 disabled:hover:bg-white/10 transition-all duration-300"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next &gt;
            </motion.button>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default PetDating;