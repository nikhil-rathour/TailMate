import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHeart, FiShoppingBag, FiHome, FiPhone, FiAward  ,FiBook} from 'react-icons/fi';
import VideoBackground from '../videos/VideoBackground';

export default function Home() {
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
  
  return (
    <div className="bg-navy min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative bg-navy h-[80vh] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg"
          >
            Connecting Hearts, One Paw at a Time.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl mb-8 text-gold font-medium drop-shadow max-w-3xl"
          >
            Your ultimate pet companion ecosystem for dating, adoption, marketplace, and AI care.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center max-w-4xl mx-auto"
          >
            <Link to="/dating" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-6 sm:px-8 py-3 rounded-full font-bold text-base sm:text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2"
              >
                <FiHeart /> Find Your Fur-ever Friend
              </motion.button>
            </Link>
            <Link to="/aipetcare" className="w-full sm:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 sm:px-8 py-3 rounded-full font-bold text-base sm:text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiAward /> AI Pet Care
              </motion.button>
            </Link>
          </motion.div>
        </div>
        {/* <div className="absolute inset-0 bg-[url('/pets-hero.jpg')] bg-cover bg-center opacity-20 z-0" /> */}
        <VideoBackground/>

      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold mb-4 text-gold tracking-tight"
        >
          Discover TailMate's Core Features
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/80 mb-10 max-w-3xl mx-auto"
        >
          A comprehensive ecosystem designed to enhance every aspect of pet ownership.
        </motion.p>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8"
        >
          {[
            { title: 'Pet Dating', desc: 'Discover compatible furry friends.', color: 'bg-white/10', icon: <FiHeart className="text-gold text-3xl mb-4" />, btn: 'Start Matching', link: '/dating' },
            { title: 'Pet Adoption', desc: 'Give a loving home to pets in need.', color: 'bg-white/10', icon: <FiHome className="text-gold text-3xl mb-4" />, btn: 'Adopt Now', link: '/petsection' },
            { title: 'Pet Stories', desc: 'Share and explore heartwarming pet stories.', color: 'bg-white/10', icon: <FiBook className="text-gold text-3xl mb-4" />, btn: 'Shop Now', link: '/stories' },
            { title: 'Emergency Help', desc: 'Access nearby vets & services.', color: 'bg-white/10', icon: <FiPhone className="text-gold text-3xl mb-4" />, btn: 'Get Help', link: '/doctor' },
            { title: 'AI PetCare', desc: 'Personalized care plans.', color: 'bg-white/10', icon: <FiAward className="text-gold text-3xl mb-4" />, btn: 'Optimize Care', link: '/aipetcare' },
          ].map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className={`p-6 rounded-3xl ${feature.color} backdrop-blur-sm flex flex-col items-center border border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500`}
            > 
              {feature.icon}
              <h3 className="text-xl font-bold mb-2 text-gold">{feature.title}</h3>
              <p className="text-base text-white/70 mb-6">{feature.desc}</p>
              <Link to={feature.link}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-6 py-2 rounded-full font-semibold shadow transition-all duration-300 flex items-center gap-2"
                >
                  {feature.btn} <FiArrowRight size={14} />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>



      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gold">Why Choose TailMate?</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">We're more than just a pet platform - we're a community dedicated to the wellbeing of pets and their owners.</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: 'Verified Pet Profiles', desc: 'All pets on our platform are verified by our team to ensure accurate information and safe interactions.' },
              { title: 'Community Support', desc: 'Join a thriving community of pet lovers who share advice, experiences, and friendship.' },
              { title: 'Expert Guidance', desc: 'Access to veterinarians, trainers, and pet care specialists for all your pet-related questions.' },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-gold to-accent-orange rounded-full flex items-center justify-center text-navy font-bold text-xl mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gold">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partners */}
     
    </div>
  );
}
