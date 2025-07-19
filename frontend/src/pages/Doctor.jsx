import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  console.log(userLocation);
 
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
    <div className="bg-navy min-h-screen px-2 md:px-8 py-8 flex flex-col gap-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden h-48 md:h-64 flex items-center justify-center bg-navy shadow-xl border-2 border-navy/10">
        <img
          src="https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=900&q=80"
          alt="Emergency vet"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gold drop-shadow-lg mb-2">Find Pet Clinics Near You</h1>
          <p className="text-white text-base md:text-lg mb-4 drop-shadow">Discover nearby veterinary clinics and hospitals for your pet's healthcare needs.</p>
          <button 
            className="bg-gold hover:bg-accent-orange text-navy font-bold px-6 py-2 rounded-full shadow transition"
            onClick={fetchNearbyClinics}
            disabled={loading || !userLocation}
          >
            {loading ? "Searching..." : "Find Nearby Clinics"}
          </button>
        </div>
      </section>

      {/* Clinics Section */}
      <section className="bg-white rounded-2xl shadow-xl p-6 border-2 border-navy/10">
        <h2 className="text-xl font-bold mb-6 text-navy">Nearby Pet Clinics</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.length > 0 ? (
              clinics.map((clinic, idx) => (
                <div key={idx} className="bg-white rounded-2xl border-2 border-navy/10 shadow hover:shadow-lg transition flex flex-col overflow-hidden">
                  <div className="bg-lightgray h-32 flex items-center justify-center">
                    <span className="text-4xl">🏥</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="font-bold text-navy text-lg mb-1">{clinic.hospital_name}</div>
                    <div className="text-xs text-softgray mb-2">{clinic.hospital_address}</div>
                    
                    <div className="flex items-center gap-1 text-gold text-sm mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i}>{i < Math.round(clinic.rating || 0) ? '★' : '☆'}</span>
                      ))}
                      <span className="text-softgray ml-1">{clinic.rating || 'No rating'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold">Distance:</span>
                      <span className="text-sm text-softgray">{clinic.distance_km} km</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold">Contact:</span>
                      <span className="text-sm text-softgray">{clinic.contact_number}</span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm font-semibold">Services:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {clinic.services.map((service, i) => (
                          <span key={i} className="bg-lightgray text-navy text-xs px-2 py-1 rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-2 flex gap-2">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.hospital_name + ' ' + clinic.hospital_address)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-gold hover:bg-accent-orange text-navy font-bold py-2 px-4 rounded-full shadow transition text-xs flex-1 text-center"
                      >
                        View on Maps
                      </a>
                      <a 
                        href={clinic.contact_number && clinic.contact_number !== "Not available" ? `tel:${clinic.contact_number.replace(/\s+/g, '')}` : "#"}
                        className={`bg-navy hover:bg-navy/80 text-white font-bold py-2 px-4 rounded-full shadow transition text-xs flex-1 text-center ${clinic.contact_number === "Not available" ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={(e) => clinic.contact_number === "Not available" && e.preventDefault()}
                      >
                        Call Now
                      </a>
                    
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-softgray">No clinics found. Please try searching in a different area.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Emergency Resources Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        
        {/* First Aid Guides */}
        {/* <div className="flex-1 bg-white rounded-2xl shadow-xl p-5 border-2 border-navy/10">
          <h2 className="text-lg font-bold mb-2 text-navy">Pet First Aid Guides</h2>
          <ul className="divide-y">
            {firstAidGuides.map((guide, idx) => (
              <li key={idx}>
                <button
                  className="w-full flex justify-between items-center py-2 font-medium text-left hover:text-gold transition"
                  onClick={() => setOpenGuide(openGuide === idx ? null : idx)}
                >
                  {guide.title}
                  <span>{openGuide === idx ? '▲' : '▼'}</span>
                </button>
                {openGuide === idx && (
                  <div className="text-xs text-navy pb-2 pl-2 animate-fade-in">
                    {guide.content}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div> */}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center mt-2">
        <button className="flex items-center gap-2 bg-white rounded-2xl shadow px-6 py-3 font-semibold text-navy hover:bg-gold/20 hover:text-gold transition border border-navy/10">
          <span className="text-2xl">📞</span> Call Vet Now
        </button>
        <button className="flex items-center gap-2 bg-white rounded-2xl shadow px-6 py-3 font-semibold text-navy hover:bg-gold/20 hover:text-gold transition border border-navy/10">
          <span className="text-2xl">📍</span> Find Nearest Pet Store
        </button>
        <button className="flex items-center gap-2 bg-white rounded-2xl shadow px-6 py-3 font-semibold text-navy hover:bg-gold/20 hover:text-gold transition border border-navy/10">
          <span className="text-2xl">🚨</span> Report Lost Pet
        </button>
        <button className="flex items-center gap-2 bg-white rounded-2xl shadow px-6 py-3 font-semibold text-navy hover:bg-gold/20 hover:text-gold transition border border-navy/10">
          <span className="text-2xl">🩺</span> Pet First Aid
        </button>
      </div>
    </div>
  );
};

export default Doctor;