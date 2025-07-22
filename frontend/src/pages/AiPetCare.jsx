import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiAward, FiActivity, FiDroplet, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function AiPetCare() {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [petData, setPetData] = useState({
    petName: '',
    petType: '',
    petBreed: '',
    petAge: '',
    petWeight: '',
    petCity: '',
    temperature: '',
    gander: ''
  });
  const [careRecommendations, setCareRecommendations] = useState(null);
  const [error, setError] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/aipetcare`, { petData });
      setCareRecommendations(response.data.result);
      
      // First close the form with animation
      setShowForm(false);
      
      // Then scroll to results after form closes
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 600); // Longer delay for smoother transition
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      // Scroll to form when opening with a slight delay for smoother animation
      setTimeout(() => {
        const formSection = document.getElementById('form-section');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
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
            AI Pet Care
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 text-gold font-medium drop-shadow max-w-3xl"
          >
            Get personalized care recommendations for your furry friend using our advanced AI technology
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              onClick={toggleForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] flex items-center gap-2"
            >
              Get Care Recommendations {showForm ? <FiChevronUp /> : <FiChevronDown />}
            </motion.button>
          </motion.div>
        </div>
        <div className="absolute right-0 bottom-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1601758123927-195e4b9f6e0e')] bg-cover bg-center opacity-20 z-0" />
      </section>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.section 
            id="form-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="py-16 px-4 max-w-4xl mx-auto overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gold/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500"
            >
              <h2 className="text-3xl font-bold mb-6 text-gold text-center">Tell Us About Your Pet</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div variants={itemVariants}>
                    <label className="block text-gold mb-2 font-medium">Pet Name</label>
                    <input
                      type="text"
                      name="petName"
                      value={petData.petName}
                      onChange={handleChange}
                      className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                      required
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-gold mb-2 font-medium">Pet Type</label>
                    <select
                      name="petType"
                      value={petData.petType}
                      onChange={handleChange}
                      className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                      required
                    >
                      <option value="">Select pet type</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Fish">Fish</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-gold mb-2 font-medium">Gender</label>
                    <select
                      name="gander"
                      value={petData.gander}
                      onChange={handleChange}
                      className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-gold mb-2 font-medium">Breed</label>
                    <input
                      type="text"
                      name="petBreed"
                      value={petData.petBreed}
                      onChange={handleChange}
                      className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                      required
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-gold mb-2 font-medium">Age (years)</label>
                    <input
                      type="number"
                      name="petAge"
                      value={petData.petAge}
                      onChange={handleChange}
                      className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                      required
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-gold mb-2 font-medium">Weight (kg)</label>
                    <input
                      type="number"
                      name="petWeight"
                      value={petData.petWeight}
                      onChange={handleChange}
                      className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                      required
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-gold mb-2 font-medium">City</label>
                    <input
                      type="text"
                      name="petCity"
                      value={petData.petCity}
                      onChange={handleChange}
                      className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                      required
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-gold mb-2 font-medium">Local Temperature (°C)</label>
                    <input
                      type="number"
                      name="temperature"
                      value={petData.temperature}
                      onChange={handleChange}
                      className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
                      required
                    />
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="text-center pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button 
                    type="submit" 
                    className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105 flex items-center gap-2 mx-auto"
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-b-2 border-navy rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FiSend /> Get Care Recommendations
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-white text-center"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {careRecommendations && (
          <motion.section 
            id="results-section"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="py-16 px-4 max-w-5xl mx-auto scroll-mt-16"
          >
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gold/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500">
              <h2 className="text-3xl font-bold mb-8 text-gold text-center">Care Recommendations for {petData.petName}</h2>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <motion.div 
                  variants={itemVariants}
                  className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60 hover:bg-gradient-to-br hover:from-navy/70 hover:to-navy/40 group"
                >
                  <div className="flex items-center mb-4">
                    <FiAward className="text-gold text-2xl mr-3" />
                    <h3 className="text-xl font-bold text-gold">Food Recommendations</h3>
                  </div>
                  <p className="mb-2"><span className="text-gold font-medium">Ideal Food Type:</span> {careRecommendations.petType}</p>
                  <p className="mb-2"><span className="text-gold font-medium">Recommended Brands:</span></p>
                  <ul className="mb-4 space-y-2">
                    {careRecommendations.food_brands.map((brand, idx) => (
                      <motion.li 
                        key={idx} 
                        whileHover={{ x: 5 }}
                        className="mb-2"
                      >
                        <a 
                          href={careRecommendations.food_brand_products_links[idx]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center p-2 rounded-lg border border-gold/20 bg-navy/30 hover:bg-gradient-to-r hover:from-gold/20 hover:to-navy/30 transition-all duration-300 hover:shadow-md group"
                        >
                          <span className="text-white group-hover:text-gold transition-colors">{brand}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gold/50 group-hover:text-gold transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                  <p className="mb-2"><span className="text-gold font-medium">Meal Size:</span> {careRecommendations.meal_grams}g</p>
                  <p className="mb-2"><span className="text-gold font-medium">Meals Per Day:</span> {careRecommendations.meals_per_day}</p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60 hover:bg-gradient-to-br hover:from-navy/70 hover:to-navy/40 group"
                >
                  <div className="flex items-center mb-4">
                    <FiActivity className="text-gold text-2xl mr-3" />
                    <h3 className="text-xl font-bold text-gold">Exercise & Activity</h3>
                  </div>
                  <p className="mb-2"><span className="text-gold font-medium">Workout Type:</span> {careRecommendations.workout}</p>
                  <p className="mb-2"><span className="text-gold font-medium">Walking Distance:</span> {careRecommendations.walking_km_per_day}km per day</p>
                  <p className="mb-2"><span className="text-gold font-medium">Recommended Activities:</span></p>
                  <ul className="list-disc pl-5 space-y-1">
                    {careRecommendations.daily_activities.map((activity, idx) => (
                      <motion.li 
                        key={idx}
                        whileHover={{ x: 5 }}
                        className="text-white/90"
                      >
                        {activity}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60 hover:bg-gradient-to-br hover:from-navy/70 hover:to-navy/40 group"
                >
                  <div className="flex items-center mb-4">
                    <FiDroplet className="text-gold text-2xl mr-3" />
                    <h3 className="text-xl font-bold text-gold">Grooming & Care</h3>
                  </div>
                  <p className="mb-2"><span className="text-gold font-medium">Baths Per Month:</span> {careRecommendations.baths_per_month}</p>
                  <p className="mb-2"><span className="text-gold font-medium">Best Bath Time:</span> {careRecommendations.bath_time}</p>
                  <p className="mb-4"><span className="text-gold font-medium">Other Tips:</span> {careRecommendations.other_recommendations}</p>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-10 text-center"
              >
                <h3 className="text-xl font-bold mb-4 text-gold">More Resources</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { text: 'Find Local Vets', icon: '🏥' },
                    { text: 'Pet Training Tips', icon: '🦮' },
                    { text: 'Pet Community', icon: '👥' }
                  ].map((resource, idx) => (
                    <motion.a 
                      key={idx}
                      href="#" 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] flex items-center gap-2"
                    >
                      <span>{resource.icon}</span> {resource.text}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold mb-8 text-gold text-center"
        >
          Why Use AI Pet Care?
        </motion.h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { title: 'Personalized Care', desc: 'Tailored recommendations based on your pet\'s specific needs.', icon: '🎯' },
            { title: 'Expert Knowledge', desc: 'Backed by veterinary science and pet care research.', icon: '🧠' },
            { title: 'Easy to Follow', desc: 'Simple, actionable advice you can implement right away.', icon: '✅' },
            { title: 'Always Available', desc: '24/7 access to care recommendations whenever you need them.', icon: '⏰' },
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gold">{feature.title}</h3>
              <p className="text-white/80">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}