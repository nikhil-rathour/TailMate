import React, { useState } from 'react';

const petTypes = [
  { label: 'All Pets', value: 'all' },
  { label: 'Dogs', value: 'dog' },
  { label: 'Cats', value: 'cat' },
  { label: 'Birds', value: 'bird' },
  { label: 'Small Animals', value: 'small' },
];

const ageRanges = [
  { label: '0-1 Year (Puppy/Kitten)', value: '0-1' },
  { label: '1-5 Years (Adult)', value: '1-5' },
  { label: '5+ Years (Senior)', value: '5+' },
];

const partners = [
  { name: 'Paws & Claws Rescue', value: 'paws', icon: '🦴' },
  { name: 'Feline Friends Shelter', value: 'feline', icon: '🐱' },
  { name: 'Canine Companions', value: 'canine', icon: '🐶' },
  { name: 'Wings of Hope', value: 'wings', icon: '🐦' },
  { name: 'Critter Care', value: 'critter', icon: '🐹' },
  { name: 'Kitty Haven', value: 'kitty', icon: '🐾' },
];

const listingTypes = [
  { label: 'All Listings', value: 'all' },
  { label: 'Adoption', value: 'adoption' },
  { label: 'For Sale', value: 'sale' },
];

const mockPets = [
  {
    id: 1,
    name: 'Buddy',
    type: 'dog',
    breed: 'Golden Retriever',
    age: '2 years',
    ageRange: '1-5',
    location: 'New York, NY',
    partner: 'paws',
    img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80',
    isNew: true,
    listingType: 'adoption',
  },
  {
    id: 2,
    name: 'Whiskers',
    type: 'cat',
    breed: 'Siamese Cat',
    age: '1 year',
    ageRange: '0-1',
    location: 'Los Angeles, CA',
    partner: 'feline',
    img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
    isNew: true,
    listingType: 'sale',
    price: 250,
  },
  {
    id: 3,
    name: 'Coco',
    type: 'bird',
    breed: 'Cockatiel',
    age: '8 months',
    ageRange: '0-1',
    location: 'Miami, FL',
    partner: 'wings',
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80',
    isNew: true,
    listingType: 'adoption',
  },
  {
    id: 4,
    name: 'Hazel',
    type: 'dog',
    breed: 'Beagle',
    age: '3 years',
    ageRange: '1-5',
    location: 'Chicago, IL',
    partner: 'canine',
    img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80',
    isNew: false,
    listingType: 'sale',
    price: 400,
  },
  {
    id: 5,
    name: 'Mittens',
    type: 'cat',
    breed: 'Maine Coon',
    age: '4 years',
    ageRange: '1-5',
    location: 'Houston, TX',
    partner: 'feline',
    img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80',
    isNew: false,
    listingType: 'adoption',
  },
  {
    id: 6,
    name: 'Chirp',
    type: 'bird',
    breed: 'Parakeet',
    age: '6 months',
    ageRange: '0-1',
    location: 'Phoenix, AZ',
    partner: 'wings',
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80',
    isNew: true,
    listingType: 'sale',
    price: 60,
  },
  {
    id: 7,
    name: 'Pip',
    type: 'small',
    breed: 'Hamster',
    age: '6 months',
    ageRange: '0-1',
    location: 'Philadelphia, PA',
    partner: 'critter',
    img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80',
    isNew: false,
    listingType: 'adoption',
  },
  {
    id: 8,
    name: 'Max',
    type: 'dog',
    breed: 'German Shepherd',
    age: '5 years',
    ageRange: '5+',
    location: 'San Diego, CA',
    partner: 'paws',
    img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80',
    isNew: false,
    listingType: 'sale',
    price: 500,
  },
  {
    id: 9,
    name: 'Luna',
    type: 'cat',
    breed: 'Tabby Cat',
    age: '2 years',
    ageRange: '1-5',
    location: 'Dallas, TX',
    partner: 'kitty',
    img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
    isNew: true,
    listingType: 'adoption',
  },
  {
    id: 10,
    name: 'Snowball',
    type: 'small',
    breed: 'Rabbit',
    age: '1 year',
    ageRange: '0-1',
    location: 'San Jose, CA',
    partner: 'critter',
    img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80',
    isNew: false,
    listingType: 'sale',
    price: 80,
  },
  {
    id: 11,
    name: 'Rocky',
    type: 'dog',
    breed: 'Bulldog',
    age: '4 years',
    ageRange: '1-5',
    location: 'Austin, TX',
    partner: 'canine',
    img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80',
    isNew: true,
    listingType: 'adoption',
  },
  {
    id: 12,
    name: 'Shadow',
    type: 'cat',
    breed: 'Black Cat',
    age: '3 years',
    ageRange: '1-5',
    location: 'Jacksonville, FL',
    partner: 'kitty',
    img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
    isNew: true,
    listingType: 'sale',
    price: 300,
  },
];

const PetSection = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAges, setSelectedAges] = useState([]);
  const [location, setLocation] = useState('');
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [sort, setSort] = useState('recent');
  const [selectedListingType, setSelectedListingType] = useState('all');
  const [page, setPage] = useState(1);
  const petsPerPage = 8;

  // Filtering logic
  const filteredPets = mockPets.filter((pet) => {
    const typeMatch = selectedType === 'all' || pet.type === selectedType;
    const ageMatch = selectedAges.length === 0 || selectedAges.includes(pet.ageRange);
    const locationMatch = !location || pet.location.toLowerCase().includes(location.toLowerCase());
    const partnerMatch = selectedPartners.length === 0 || selectedPartners.includes(pet.partner);
    const listingTypeMatch = selectedListingType === 'all' || pet.listingType === selectedListingType;
    return typeMatch && ageMatch && locationMatch && partnerMatch && listingTypeMatch;
  });

  // Sorting logic
  const sortedPets = [...filteredPets].sort((a, b) => {
    if (sort === 'recent') return b.isNew - a.isNew;
    if (sort === 'age') return a.age.localeCompare(b.age);
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedPets.length / petsPerPage);
  const paginatedPets = sortedPets.slice((page - 1) * petsPerPage, page * petsPerPage);

  // Handlers
  const handleTypeChange = (value) => {
    setSelectedType(value);
    setPage(1);
  };
  const handleAgeChange = (value) => {
    setSelectedAges((prev) => prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]);
    setPage(1);
  };
  const handlePartnerChange = (value) => {
    setSelectedPartners((prev) => prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]);
    setPage(1);
  };
  const handleClearFilters = () => {
    setSelectedType('all');
    setSelectedAges([]);
    setLocation('');
    setSelectedPartners([]);
    setSelectedListingType('all');
    setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 px-2 md:px-8 py-8 bg-navy min-h-screen">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 bg-white rounded-2xl shadow-xl p-6 mb-4 md:mb-0 sticky top-24 self-start h-fit border-2 border-navy/10">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gold"><span className="text-xl">▲</span> Filters</h2>
        {/* Listing Type Filter */}
        <div className="mb-4">
          <div className="font-semibold mb-2 text-navy">Listing Type</div>
          <ul className="space-y-1">
            {listingTypes.map((type) => (
              <li key={type.value}>
                <button
                  className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-gold/10 transition ${selectedListingType === type.value ? 'text-gold font-bold' : 'text-navy'}`}
                  onClick={() => { setSelectedListingType(type.value); setPage(1); }}
                >
                  <span className={`w-3 h-3 rounded-full border ${selectedListingType === type.value ? 'bg-gold border-gold' : 'border-navy/10'}`}></span>
                  {type.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2 text-navy">Pet Type</div>
          <ul className="space-y-1">
            {petTypes.map((type) => (
              <li key={type.value}>
                <button
                  className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-gold/10 transition ${selectedType === type.value ? 'text-gold font-bold' : 'text-navy'}`}
                  onClick={() => handleTypeChange(type.value)}
                >
                  <span className={`w-3 h-3 rounded-full border ${selectedType === type.value ? 'bg-gold border-gold' : 'border-navy/10'}`}></span>
                  {type.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2 text-navy">Age Range</div>
          <ul className="space-y-1">
            {ageRanges.map((age) => (
              <li key={age.value}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAges.includes(age.value)}
                    onChange={() => handleAgeChange(age.value)}
                    className="accent-gold"
                  />
                  {age.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2 text-navy">Location</div>
          <input
            type="text"
            placeholder="Enter city or zip code"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold/30 text-navy"
          />
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2 text-navy">Partner NGOs</div>
          <ul className="space-y-1">
            {partners.map((p) => (
              <li key={p.value}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPartners.includes(p.value)}
                    onChange={() => handlePartnerChange(p.value)}
                    className="accent-gold"
                  />
                  {p.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="w-full bg-gold/20 text-gold font-bold py-2 rounded-full hover:bg-gold/40 transition"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-8 text-white">
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden h-48 md:h-64 flex items-center justify-center bg-navy shadow-xl border-2 border-navy/10">
          <img
            src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=900&q=80"
            alt="Adoptable pets"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gold drop-shadow-lg mb-2">Find Your Forever Friend</h1>
            <p className="text-white text-base md:text-lg mb-4 drop-shadow">Thousands of loving pets are waiting for their new home. Explore profiles from trusted shelters and NGOs.</p>
            <button className="bg-gold hover:bg-accent-orange text-navy font-bold px-6 py-2 rounded-full shadow transition">Explore Adoptable Pets</button>
          </div>
        </section>

        {/* Tabs & Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex gap-2 md:gap-4 flex-wrap">
            {petTypes.map((type) => (
              <button
                key={type.value}
                className={`px-4 py-1 rounded-full font-medium border-2 transition shadow-sm ${selectedType === type.value ? 'bg-gold text-navy border-gold' : 'bg-white text-navy border-navy/10 hover:bg-gold/10'}`}
                onClick={() => handleTypeChange(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
          <div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="border-2 border-navy/10 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-gold/30 text-navy"
            >
              <option value="recent">Most Recent</option>
              <option value="age">By Age</option>
            </select>
          </div>
        </div>

        {/* Pet Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedPets.length === 0 ? (
            <div className="col-span-full text-center text-softgray py-12">No pets found matching your criteria.</div>
          ) : (
            paginatedPets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition overflow-hidden relative group flex flex-col border-2 border-navy/10">
                <div className="relative h-40 overflow-hidden">
                  <img src={pet.img} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {pet.isNew && <span className="absolute top-2 right-2 bg-gold text-navy text-xs font-bold px-2 py-1 rounded-full shadow">New</span>}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1">{pet.name}</h3>
                    <div className="text-sm text-softgray mb-1">{pet.breed}, {pet.age}</div>
                    <div className="text-xs text-softgray mb-1">{pet.location}</div>
                    <div className="text-xs text-softgray">From: <span className="font-semibold text-gold">{partners.find(p => p.value === pet.partner)?.name}</span></div>
                    <div className="text-xs mt-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${pet.listingType === 'adoption' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{pet.listingType === 'adoption' ? 'Adoption' : 'For Sale'}</span>
                      {pet.listingType === 'sale' && pet.price && (
                        <span className="ml-2 text-blue-700 font-bold">${pet.price}</span>
                      )}
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-gold hover:bg-accent-orange text-navy font-bold py-2 rounded-full shadow transition">{pet.listingType === 'adoption' ? 'Adopt Me!' : 'Buy Now'}</button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-2">
          <button
            className="px-3 py-1 rounded-full border-2 border-navy/10 bg-white hover:bg-gold/10 text-navy disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            &lt; Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded-full border-2 ${page === idx + 1 ? 'bg-gold text-navy border-gold' : 'bg-white hover:bg-gold/10 border-navy/10 text-navy'}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded-full border-2 border-navy/10 bg-white hover:bg-gold/10 text-navy disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next &gt;
          </button>
        </div>

        {/* Partners Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 mt-6 border-2 border-navy/10">
          <h2 className="text-xl font-bold text-center mb-6 text-gold">Our Trusted Adoption Partners</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
            {partners.map((p) => (
              <div key={p.value} className="flex flex-col items-center gap-2">
                <span className="text-4xl">{p.icon}</span>
                <div className="font-semibold text-navy text-center">{p.name}</div>
                <button className="text-gold hover:underline text-sm">Learn More &rarr;</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PetSection;