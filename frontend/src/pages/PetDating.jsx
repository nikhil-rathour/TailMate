import React, { useState } from 'react';

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
    <div className="bg-navy min-h-screen px-2 md:px-8 py-8 text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gold/20 via-beige to-lightgray rounded-2xl shadow-xl p-8 mb-8 border-2 border-navy/10">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-gold">Discover Your Pet's Perfect Match!</h1>
        <p className="text-softgray mb-4">Explore our featured pets looking for their companions. Swipe right on personality!</p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {featuredPets.map((pet, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[100px]">
              <img src={pet.img} alt={pet.name} className="w-20 h-20 rounded-full object-cover border-4 border-gold shadow mb-1" />
              <div className="font-semibold text-sm text-navy">{pet.name}</div>
              <div className="text-xs text-softgray">{pet.breed}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-2 mb-8 items-center">
        <input
          type="text"
          placeholder="Search pets by name or breed..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border-2 border-navy/10 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold/30 bg-white shadow text-navy"
        />
        <select value={breed} onChange={e => setBreed(e.target.value)} className="rounded-full px-4 py-2 border-2 border-navy/10 bg-white shadow text-navy">
          {breeds.map(b => <option key={b}>{b}</option>)}
        </select>
        <select value={age} onChange={e => setAge(e.target.value)} className="rounded-full px-4 py-2 border-2 border-navy/10 bg-white shadow text-navy">
          {ages.map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={activity} onChange={e => setActivity(e.target.value)} className="rounded-full px-4 py-2 border-2 border-navy/10 bg-white shadow text-navy">
          {activities.map(a => <option key={a}>{a}</option>)}
        </select>
      </div>

      {/* Pet Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginated.length === 0 ? (
          <div className="col-span-full text-center text-softgray py-12">No pets found matching your criteria.</div>
        ) : (
          paginated.map((pet, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition overflow-hidden flex flex-col relative group border-2 border-navy/10">
              <img src={pet.img} alt={pet.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-navy">{pet.name}</h3>
                    <button className="text-softgray hover:text-gold text-xl transition">♡</button>
                  </div>
                  <div className="text-sm text-softgray mb-1">{pet.breed} • {pet.age} • {pet.gender}</div>
                  <div className="text-xs text-softgray mb-1">{pet.desc}</div>
                  <div className="flex items-center gap-2 text-xs text-softgray mb-1">
                    <span>📍 {pet.location}</span>
                    <span>⚡ Activity: {pet.activity}</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-gold hover:bg-accent-orange text-navy font-bold py-2 rounded-full shadow transition">View Profile</button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`w-8 h-8 rounded-full border-2 font-bold ${page === idx + 1 ? 'bg-gold text-navy border-gold' : 'bg-white hover:bg-gold/10 border-navy/10 text-navy'}`}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PetDating;