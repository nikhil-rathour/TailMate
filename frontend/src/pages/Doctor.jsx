import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiStar, FiSearch, FiHelpCircle } from 'react-icons/fi';
// import VideoBackground from '../videos/VideoBackground';

const emergencyContacts = [
  { name: 'Poison Control Hotline', phone: '(888) 426-4435', desc: 'For pet-related poisoning emergencies.', icon: '☏' },
  { name: 'Animal Rescue League', phone: '(555) 123-4567', desc: 'Assistance with lost or stray animals.', icon: '🐾' },
  { name: '24/7 Emergency Vet', phone: '(959) 987-6543', desc: 'Immediate veterinary care for critical cases.', icon: '⏰' },
  { name: 'Pet Ambulance Service', phone: '(555) 222-3333', desc: 'On-demand pet transport to vet facilities.', icon: '🚑' },
];

const firstAidGuides = [
  { title: 'Choking Pet', content: 'If your pet is choking, try to remove the object if visible. If not, perform gentle chest compressions and seek immediate veterinary help.' },
  { title: 'Heatstroke Symptoms', content: 'Signs include excessive panting, drooling, weakness. Move your pet to a cool place, offer water, and contact a vet immediately.' },
  { title: 'Minor Cuts/Scrapes', content: 'Clean the wound with saline, apply gentle pressure to stop bleeding, and cover with a clean bandage. See a vet if deep or not healing.' },
  { title: 'Seizure First Aid', content: 'Keep your pet safe from injury, do not restrain, and time the seizure. Contact your vet as soon as possible.' },
];

const Doctor = () => {
  const [openGuide, setOpenGuide] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);

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

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to access your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch nearby clinics when user location is available
  useEffect(() => {
    if (userLocation) {
      fetchNearbyClinics();
    }
  }, [userLocation]);

  const fetchNearbyClinics = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/doctor`, {
        location: userLocation
      });
      
      if (response.data.success && response.data.result) {
        setClinics(response.data.result);
      } else {
        setError("No clinics found nearby.");
      }
    } catch (err) {
      console.error("Error fetching clinics:", err);
      setError("Failed to fetch nearby clinics. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative bg-navy h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg"
          >
            Pet Healthcare Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 text-gold font-medium drop-shadow max-w-3xl"
          >
            Find nearby veterinary clinics and emergency services for your beloved companions
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button 
              onClick={fetchNearbyClinics}
              disabled={loading || !userLocation}
              className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105 disabled:opacity-50 flex items-center gap-2"
            >
              <FiMapPin /> Find Nearby Clinics
            </button>
            <button 
              onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FiHelpCircle /> Emergency Contacts
            </button>
          </motion.div>
        </div>

        {/* bg - image */}
        {/* <VideoBackground/> */}

        {/* <div className="absolute right-0 bottom-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550831107-1553da8c8464')] bg-cover bg-center opacity-20 z-0" /> */}
     
      </section>

      {/* Emergency Contacts Section - Conditionally Rendered */}
      {showEmergencyContacts && (
        <motion.section 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="py-8 px-4 max-w-7xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-gold/20">
            <h2 className="text-2xl font-bold mb-6 text-gold text-center">Emergency Pet Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergencyContacts.map((contact, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-navy/50 p-4 rounded-xl border border-gold/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300"
                >
                  <div className="text-3xl mb-2 text-gold">{contact.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{contact.name}</h3>
                  <p className="text-sm text-white/70 mb-3">{contact.desc}</p>
                  <a 
                    href={`tel:${contact.phone.replace(/\D/g,'')}`}
                    className="inline-flex items-center gap-2 bg-gold/20 hover:bg-gold/30 text-white px-4 py-2 rounded-full text-sm transition-all duration-300"
                  >
                    <FiPhone /> {contact.phone}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Clinics Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-extrabold mb-8 text-gold text-center"
        >
          Nearby Pet Clinics
        </motion.h2>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto text-center"
          >
            {error}
          </motion.div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="relative">
              <div className="w-16 h-16 border-t-4 border-b-4 border-gold rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-r-4 border-l-4 border-gold/30 rounded-full animate-spin absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {clinics.length > 0 ? (
              clinics.map((clinic, idx) => (
                <motion.div 
                  key={idx} 
                  variants={itemVariants}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500 group"
                >
                  <div className="h-40 bg-gradient-to-r from-navy/80 to-navy/40 flex items-center justify-center relative overflow-hidden">
                    <span className="text-6xl">🏥</span>
                    {clinic.rating && (
                      <div className="absolute top-4 right-4 bg-gold/90 text-navy text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <FiStar /> {clinic.rating}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gold">{clinic.hospital_name}</h3>
                    <p className="text-white/70 text-sm mb-4">{clinic.hospital_address}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gold/80">Distance:</span>
                        <span className="text-white/80">{clinic.distance_km} km</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-gold/80">Contact:</span>
                        <span className="text-white/80">{clinic.contact_number || 'Not available'}</span>
                      </div>
                    </div>
                    
                    {clinic.services && clinic.services.length > 0 && (
                      <div className="mb-4">
                        <span className="text-gold/80 block mb-2">Services:</span>
                        <div className="flex flex-wrap gap-2">
                          {clinic.services.map((service, i) => (
                            <span key={i} className="bg-white/10 text-white/90 text-xs px-2 py-1 rounded-full">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-3 mt-4">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.hospital_name + ' ' + clinic.hospital_address)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy py-2 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <FiMapPin /> View on Maps
                      </a>
                      <a 
                        href={clinic.contact_number && clinic.contact_number !== "Not available" ? `tel:${clinic.contact_number.replace(/\s+/g, '')}` : "#"}
                        className={`flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg ${clinic.contact_number === "Not available" ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={(e) => clinic.contact_number === "Not available" && e.preventDefault()}
                      >
                        <FiPhone /> Call Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <p className="text-xl text-white/70 mb-4">No clinics found in your area yet.</p>
                <p className="text-white/50 mb-6">Try searching again or check your location settings.</p>
                <button 
                  onClick={fetchNearbyClinics}
                  className="bg-gold text-navy px-6 py-2 rounded-full font-medium hover:bg-accent-orange transition-all duration-300"
                >
                  Retry Search
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>

      {/* First Aid Guides Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-gold text-center">Pet First Aid Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {firstAidGuides.map((guide, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300"
            >
              <button
                className="w-full flex justify-between items-center p-4 font-bold text-left hover:text-gold transition-all duration-300"
                onClick={() => setOpenGuide(openGuide === idx ? null : idx)}
              >
                <span className="text-lg">{guide.title}</span>
                <span className="text-gold transition-transform duration-300" style={{ transform: openGuide === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: openGuide === idx ? 'auto' : 0,
                  opacity: openGuide === idx ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 text-white/80">
                  {guide.content}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-gold text-center">Quick Actions</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {[
            { icon: '📞', text: 'Call Vet Now' },
            { icon: '📍', text: 'Find Nearest Pet Store' },
            { icon: '🚨', text: 'Report Lost Pet' },
            { icon: '🩺', text: 'Pet First Aid' }
          ].map((action, idx) => (
            <motion.button 
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 font-bold text-white hover:bg-white/20 transition-all duration-300 border border-gold/20"
            >
              <span className="text-2xl">{action.icon}</span> {action.text}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gold">Stay Updated on Pet Health</h2>
          <p className="text-lg mb-6 text-white/80">Subscribe to our newsletter for pet health tips, clinic updates, and emergency preparedness guides.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-full bg-white/10 border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-6 py-3 rounded-full font-bold transition-all duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Doctor;