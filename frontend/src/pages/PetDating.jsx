import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiHeart, FiMapPin, FiActivity } from 'react-icons/fi';

const featuredPets = [
  { name: 'Buddy', breed: 'Golden Retriever', img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80' },
  { name: 'Luna', breed: 'Siamese Cat', img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Max', breed: 'German Shepherd', img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80' },
  { name: 'Daisy', breed: 'Labrador', img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Oscar', breed: 'Beagle', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chloe', breed: 'Persian Cat', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
];

const allPets = [
  {
    name: 'Buddy', breed: 'Golden Retriever', age: '2 years', gender: 'Male', desc: 'A playful and friendly golden retriever, loves long walks and belly rubs. Great with kids and other pets.', location: 'San Francisco, CA', activity: 'High', img: featuredPets[0].img,
  },
  {
    name: 'Luna', breed: 'Siamese Cat', age: '1 year', gender: 'Female', desc: 'An elegant siamese cat with striking blue eyes, enjoys quiet evenings and sunbathing. Very affectionate once she warms up.', location: 'Los Angeles, CA', activity: 'Medium', img: featuredPets[1].img,
  },
  {
    name: 'Max', breed: 'German Shepherd', age: '3 years', gender: 'Male', desc: 'Loyal and intelligent German Shepherd, looking for an active family. He excels in obedience training and loves to explore.', location: 'Seattle, WA', activity: 'High', img: featuredPets[2].img,
  },
  {
    name: 'Daisy', breed: 'Labrador', age: '4 years', gender: 'Female', desc: 'Sweet and gentle Labrador, perfect companion for a calm household. She enjoys short walks and cuddles on the couch.', location: 'Denver, CO', activity: 'Medium', img: featuredPets[3].img,
  },
  {
    name: 'Oscar', breed: 'Beagle', age: '1.5 years', gender: 'Male', desc: 'Curious and energetic beagle, always ready for an adventure. He loves sniffing out new trails and playing fetch.', location: 'Austin, TX', activity: 'High', img: featuredPets[4].img,
  },
  {
    name: 'Chloe', breed: 'Persian Cat', age: '2 years', gender: 'Female', desc: 'A beautiful Persian cat, enjoys quiet indoor life and being pampered. Her long fur requires regular grooming.', location: 'Miami, FL', activity: 'Low', img: featuredPets[5].img,
  },
  {
    name: 'Rocky', breed: 'Bulldog', age: '5 years', gender: 'Male', desc: 'A lovable bulldog with a charming personality. Enjoys napping and short walks, a great couch potato companion.', location: 'Chicago, IL', activity: 'Low', img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Misty', breed: 'Maine Coon', age: '3 years', gender: 'Female', desc: 'Gentle giant Maine Coon, enjoys interactive play and bird watching from windows. Very vocal and expressive.', location: 'Portland, OR', activity: 'Medium', img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
  },
];

const breeds = ['All Breeds', ...Array.from(new Set(allPets.map(p => p.breed)))];
const ages = ['All Ages', 'Puppy/Kitten', 'Young', 'Adult', 'Senior'];
const activities = ['All Activity', 'Low', 'Medium', 'High'];

const PetDating = () => {
  const [search, setSearch] = useState('');
  const [breed, setBreed] = useState('All Breeds');
  const [age, setAge] = useState('All Ages');
  const [activity, setActivity] = useState('All Activity');
  const [page, setPage] = useState(1);
  const petsPerPage = 8;
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Filter logic
  const filtered = allPets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase()) || pet.breed.toLowerCase().includes(search.toLowerCase());
    const matchesBreed = breed === 'All Breeds' || pet.breed === breed;
    const matchesActivity = activity === 'All Activity' || pet.activity === activity;
    // Age filter is a placeholder for now
    return matchesSearch && matchesBreed && matchesActivity;
  });
  const paginated = filtered.slice((page - 1) * petsPerPage, page * petsPerPage);
  const totalPages = Math.ceil(filtered.length / petsPerPage);

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
            Find Your Pet's Perfect Match
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 text-gold font-medium drop-shadow max-w-3xl"
          >
            Connect with compatible furry friends in your area. Swipe right on personality, not just looks!
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] flex items-center gap-2"
            >
              <FiHeart /> Start Matching
            </motion.button>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-navy/40 bg-cover bg-center opacity-80 z-0" />
      </section>
      
      {/* Featured Pets Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-gold text-center">
          Featured Pets
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-6 px-2">
          {featuredPets.map((pet, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[120px]">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold/50 mb-3 shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-300">
                <img 
                  src={pet.img} 
                  alt={pet.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x400?text=Pet';
                  }}
                />
              </div>
              <div className="font-semibold text-gold">{pet.name}</div>
              <div className="text-xs text-white/70">{pet.breed}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gold/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg flex-grow">
              <FiSearch className="text-gold mr-2" />
              <input
                type="text"
                placeholder="Search pets by name or breed..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
              <select 
                value={breed} 
                onChange={e => setBreed(e.target.value)} 
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {breeds.map(b => <option key={b}>{b}</option>)}
              </select>
              
              <select 
                value={age} 
                onChange={e => setAge(e.target.value)} 
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {ages.map(a => <option key={a}>{a}</option>)}
              </select>
              
              <select 
                value={activity} 
                onChange={e => setActivity(e.target.value)} 
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {activities.map(a => <option key={a}>{a}</option>)}
              </select>
              
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full hover:bg-gold/30 transition-all duration-300"
              >
                <FiFilter className="text-gold" /> 
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pet Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {paginated.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-white/70 mb-4">No pets found matching your criteria.</p>
              <p className="text-white/50 mb-6">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => {
                  setBreed('All Breeds');
                  setAge('All Ages');
                  setActivity('All Activity');
                  setSearch('');
                }}
                className="bg-gold text-navy px-6 py-2 rounded-full font-medium hover:bg-accent-orange transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            paginated.map((pet, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden"
                animate="visible"
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
                      e.target.src = 'https://placehold.co/400x400?text=Pet';
                    }}
                  />
                  <button 
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-gold hover:bg-white/40 transition-all duration-300"
                  >
                    <FiHeart />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gold">{pet.name}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80">{pet.breed}</span>
                    <span className="bg-white/10 text-white/90 text-xs px-2 py-1 rounded-full">{pet.gender}</span>
                  </div>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{pet.desc}</p>
                  <div className="flex justify-between items-center mb-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-gold" /> {pet.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiActivity className="text-gold" /> {pet.activity}
                    </div>
                  </div>
                  <button 
                    className="w-full bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy py-3 px-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8 px-4">
          <button
            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white disabled:opacity-50 disabled:hover:bg-white/10 transition-all duration-300"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            &lt; Previous
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  page === idx + 1
                    ? "bg-gold text-navy"
                    : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                }`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          
          <button
            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white disabled:opacity-50 disabled:hover:bg-white/10 transition-all duration-300"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next &gt;
          </button>
        </div>
      )}
      
      {/* Tips Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-4 text-gold">Pet Dating Tips</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">Make the most of your pet's dating experience with these helpful tips.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Regular Playdates', desc: 'Start with short, supervised playdates in neutral territory to help pets get comfortable with each other.' },
              { title: 'Watch Body Language', desc: 'Pay attention to how your pet interacts. Relaxed body language is a good sign of compatibility.' },
              { title: 'Similar Energy Levels', desc: 'Matching pets with similar energy and play styles often leads to the most successful relationships.' },
            ].map((tip, idx) => (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-gold to-accent-orange rounded-full flex items-center justify-center text-navy font-bold text-xl mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gold">{tip.title}</h3>
                <p className="text-white/70">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gold">
            Stay Updated on Perfect Matches
          </h2>
          <p className="text-lg mb-6 text-white/80">
            Subscribe to our newsletter to receive updates when new compatible pets join in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-full bg-white/10 border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button 
              className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-6 py-3 rounded-full font-bold transition-all duration-300"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetDating;