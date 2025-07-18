import React, { useState } from 'react';

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

const quickActions = [
  { label: 'Call Vet Now', icon: '📞' },
  { label: 'Find Nearest Pet Store', icon: '📍' },
  { label: 'Report Lost Pet', icon: '🚨' },
  { label: 'Pet First Aid', icon: '🩺' },
];

const partners = [
  { name: 'Brightwood Animal Hospital', address: '123 Elm St, Anytown, USA', rating: 4.8, img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { name: 'PawCare Emergency Center', address: '456 Oak Ave, Anytown, USA', rating: 4.9, img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
  { name: 'VetPoint Clinic & Surgery', address: '789 Pine Rd, Anytown, USA', rating: 4.7, img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
  { name: 'Gentle Paws Veterinary', address: '101 Cedar Ln, Anytown, USA', rating: 4.6, img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80' },
  { name: 'Urban Animal Hospital', address: '202 Birch Blvd, Anytown, USA', rating: 4.8, img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80' },
];

const mapMarkers = [
  { label: 'Dispet starlight & Gred caes', x: '30%', y: '40%' },
  { label: 'Potech Clinics & CanCare Convention', x: '60%', y: '70%' },
  { label: 'Pettech Clinics Lam Fair Slots', x: '70%', y: '30%' },
];

const Doctor = () => {
  const [openGuide, setOpenGuide] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

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
          <h1 className="text-2xl md:text-4xl font-extrabold text-gold drop-shadow-lg mb-2">Immediate Help When Your Pet Needs It Most</h1>
          <p className="text-white text-base md:text-lg mb-4 drop-shadow">Find nearby emergency vets, connect with expert advice, and access vital resources for your pet’s well-being, 24/7.</p>
          <button className="bg-gold hover:bg-accent-orange text-navy font-bold px-6 py-2 rounded-full shadow transition">Find Emergency Services</button>
        </div>
      </section>

      {/* Facilities & Contacts */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Map & Facilities */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 border-2 border-navy/10">
          <h2 className="text-lg font-bold mb-2 text-navy">Nearby Pet Care Facilities</h2>
          <div className="relative w-full h-64 bg-lightgray rounded-xl overflow-hidden flex items-center justify-center">
            {/* Map Placeholder */}
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0">
              {mapMarkers.map((marker, idx) => (
                <button
                  key={idx}
                  className={`absolute px-2 py-1 rounded-full bg-gold text-navy text-xs font-semibold shadow hover:bg-accent-orange transition border-2 border-white ${selectedMarker === idx ? 'ring-2 ring-gold' : ''}`}
                  style={{ left: marker.x, top: marker.y, transform: 'translate(-50%, -50%)' }}
                  onClick={() => setSelectedMarker(idx)}
                >
                  {marker.label}
                </button>
              ))}
            </div>
            <div className="relative z-10 text-center">
              <div className="bg-white/80 rounded px-4 py-2 text-navy font-medium shadow mb-2">Interactive Map Placeholder</div>
              <button className="bg-gold hover:bg-accent-orange text-navy font-bold px-4 py-1 rounded-full shadow transition text-xs">View Full Map</button>
            </div>
          </div>
        </div>
        {/* Emergency Contacts & First Aid */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-navy/10">
            <h2 className="text-lg font-bold mb-2 text-navy">Emergency Contacts</h2>
            <ul className="space-y-3">
              {emergencyContacts.map((c, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-2xl mt-1">{c.icon}</span>
                  <div>
                    <div className="font-semibold text-gold">{c.name}</div>
                    <div className="text-xs text-navy">{c.phone}</div>
                    <div className="text-xs text-softgray">{c.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-navy/10">
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
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center mt-2">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            className="flex items-center gap-2 bg-white rounded-2xl shadow px-6 py-3 font-semibold text-navy hover:bg-gold/20 hover:text-gold transition border border-navy/10"
          >
            <span className="text-2xl">{action.icon}</span> {action.label}
          </button>
        ))}
      </div>

      {/* Trusted Partners */}
      <section className=" rounded-2xl  p-6 mt-6 border-2 border-navy/10">
        <h2 className="text-xl font-bold mb-6 text-gold">Trusted Emergency Partners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl border-2 border-navy/10 shadow hover:shadow-lg transition flex flex-col overflow-hidden">
              <img src={p.img} alt={p.name} className="h-32 w-full object-cover" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-navy mb-1">{p.name}</div>
                  <div className="text-xs text-softgray mb-1">{p.address}</div>
                  <div className="flex items-center gap-1 text-gold text-sm mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>{i < Math.round(p.rating) ? '★' : '☆'}</span>
                    ))}
                    <span className="text-softgray ml-1">{p.rating}</span>
                  </div>
                </div>
                <button className="mt-2 w-full bg-gold hover:bg-accent-orange text-navy font-bold py-2 rounded-full shadow transition text-xs">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Doctor;