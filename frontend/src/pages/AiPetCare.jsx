import React, { useState } from 'react';
import axios from 'axios';

export default function AiPetCare() {
  const [loading, setLoading] = useState(false);
  const [petData, setPetData] = useState({
    petName: '',
    petType: '',
    petBreed: '',
    petAge: '',
    petWeight: '',
    petCity: '',
    temperature: '',
    gander : ''
  });
  const [careRecommendations, setCareRecommendations] = useState(null);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative bg-navy py-16 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">AI Pet Care</h1>
          <p className="text-xl md:text-2xl mb-8 text-gold font-medium drop-shadow">Get personalized care recommendations for your furry friend</p>
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1601758123927-195e4b9f6e0e')] bg-cover bg-center opacity-20 z-0" />
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-2 border-gold/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500">
          <h2 className="text-3xl font-bold mb-6 text-gold text-center">Tell Us About Your Pet</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gold mb-2 font-medium">Pet Name</label>
                <input
                  type="text"
                  name="petName"
                  value={petData.petName}
                  onChange={handleChange}
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gold mb-2 font-medium">Pet Type</label>
                <select
                  name="petType"
                  value={petData.petType}
                  onChange={handleChange}
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
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
              </div>
               <div>
                <label className="block text-gold mb-2 font-medium">Gander</label>
                <select
                  name="gander"
                  value={petData.gander}
                  onChange={handleChange}
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                >
                  <option value="">Select gander</option>
                  <option value="Dog">Mail</option>
                  <option value="Cat">Femail</option>
                
                </select>
              </div>
              
              <div>
                <label className="block text-gold mb-2 font-medium">Breed</label>
                <input
                  type="text"
                  name="petBreed"
                  value={petData.petBreed}
                  onChange={handleChange}
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gold mb-2 font-medium">Age (years)</label>
                <input
                  type="number"
                  name="petAge"
                  value={petData.petAge}
                  onChange={handleChange}
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gold mb-2 font-medium">Weight (kg)</label>
                <input
                  type="number"
                  name="petWeight"
                  value={petData.petWeight}
                  onChange={handleChange}
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gold mb-2 font-medium">City</label>
                <input
                  type="text"
                  name="petCity"
                  value={petData.petCity}
                  onChange={handleChange}
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gold mb-2 font-medium">Local Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  value={petData.temperature}
                  onChange={handleChange}
                  className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>
            </div>
            
            <div className="text-center pt-4">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105"
                disabled={loading}
              >
                {loading ? 'Generating Recommendations...' : 'Get Care Recommendations'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-white text-center">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {careRecommendations && (
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-2 border-gold/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500">
            <h2 className="text-3xl font-bold mb-6 text-gold text-center">Care Recommendations for {petData.petName}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60 hover:bg-gradient-to-br hover:from-navy/70 hover:to-navy/40">
                <h3 className="text-xl font-bold mb-3 text-gold">Food Recommendations</h3>
                <p className="mb-2"><span className="text-gold font-medium">Ideal Food Type:</span> {careRecommendations.petType}</p>
                <p className="mb-2"><span className="text-gold font-medium">Recommended Brands:</span></p>
                <ul className="mb-4">
                  {careRecommendations.food_brands.map((brand, idx) => (
                    <li key={idx} className="mb-2">
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
                    </li>
                  ))}
                </ul>
                <p className="mb-2"><span className="text-gold font-medium">Meal Size:</span> {careRecommendations.meal_grams}g</p>
                <p className="mb-2"><span className="text-gold font-medium">Meals Per Day:</span> {careRecommendations.meals_per_day}</p>
              </div>
              
              <div className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60 hover:bg-gradient-to-br hover:from-navy/70 hover:to-navy/40">
                <h3 className="text-xl font-bold mb-3 text-gold">Exercise & Activity</h3>
                <p className="mb-2"><span className="text-gold font-medium">Workout Type:</span> {careRecommendations.workout}</p>
                <p className="mb-2"><span className="text-gold font-medium">Walking Distance:</span> {careRecommendations.walking_km_per_day}km per day</p>
                <p className="mb-2"><span className="text-gold font-medium">Recommended Activities:</span></p>
                <ul className="list-disc pl-5">
                  {careRecommendations.daily_activities.map((activity, idx) => (
                    <li key={idx}>{activity}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60 hover:bg-gradient-to-br hover:from-navy/70 hover:to-navy/40">
                <h3 className="text-xl font-bold mb-3 text-gold">Grooming & Care</h3>
                <p className="mb-2"><span className="text-gold font-medium">Baths Per Month:</span> {careRecommendations.baths_per_month}</p>
                <p className="mb-2"><span className="text-gold font-medium">Best Bath Time:</span> {careRecommendations.bath_time}</p>
                <p className="mb-4"><span className="text-gold font-medium">Other Tips:</span> {careRecommendations.other_recommendations}</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-xl font-bold mb-4 text-gold">More Resources</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#" 
                  className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105"
                >
                  Find Local Vets
                </a>
                <a 
                  href="#" 
                  className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105"
                >
                  Pet Training Tips
                </a>
                <a 
                  href="#" 
                  className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105"
                >
                  Pet Community
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}