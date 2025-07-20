import React, { useState, useEffect } from "react";
import { getAllPets } from "../services/petService";
import { useNavigate } from "react-router-dom";

const petTypes = [
  { label: "All Pets", value: "all" },
  { label: "Dogs", value: "dog" },
  { label: "Cats", value: "cat" },
  { label: "Birds", value: "bird" },
  { label: "Small Animals", value: "small" },
];

const listingTypes = [
  { label: "All Listings", value: "all" },
  { label: "Adoption", value: "adoption" },
  { label: "For Sale", value: "sale" },
];

// const mockPets = [
//   {
//     id: 1,
//     name: 'Buddy',
//     type: 'dog',
//     breed: 'Golden Retriever',
//     age: '2 years',
//     ageRange: '1-5',
//     location: 'New York, NY',
//     partner: 'paws',
//     img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80',
//     isNew: true,
//     listingType: 'adoption',
//   },
//   {
//     id: 2,
//     name: 'Whiskers',
//     type: 'cat',
//     breed: 'Siamese Cat',
//     age: '1 year',
//     ageRange: '0-1',
//     location: 'Los Angeles, CA',
//     partner: 'feline',
//     img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
//     isNew: true,
//     listingType: 'sale',
//     price: 250,
//   },
//   {
//     id: 3,
//     name: 'Coco',
//     type: 'bird',
//     breed: 'Cockatiel',
//     age: '8 months',
//     ageRange: '0-1',
//     location: 'Miami, FL',
//     partner: 'wings',
//     img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80',
//     isNew: true,
//     listingType: 'adoption',
//   },
//   {
//     id: 4,
//     name: 'Hazel',
//     type: 'dog',
//     breed: 'Beagle',
//     age: '3 years',
//     ageRange: '1-5',
//     location: 'Chicago, IL',
//     partner: 'canine',
//     img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80',
//     isNew: false,
//     listingType: 'sale',
//     price: 400,
//   },
//   {
//     id: 5,
//     name: 'Mittens',
//     type: 'cat',
//     breed: 'Maine Coon',
//     age: '4 years',
//     ageRange: '1-5',
//     location: 'Houston, TX',
//     partner: 'feline',
//     img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80',
//     isNew: false,
//     listingType: 'adoption',
//   },
//   {
//     id: 6,
//     name: 'Chirp',
//     type: 'bird',
//     breed: 'Parakeet',
//     age: '6 months',
//     ageRange: '0-1',
//     location: 'Phoenix, AZ',
//     partner: 'wings',
//     img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80',
//     isNew: true,
//     listingType: 'sale',
//     price: 60,
//   },
//   {
//     id: 7,
//     name: 'Pip',
//     type: 'small',
//     breed: 'Hamster',
//     age: '6 months',
//     ageRange: '0-1',
//     location: 'Philadelphia, PA',
//     partner: 'critter',
//     img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80',
//     isNew: false,
//     listingType: 'adoption',
//   },
//   {
//     id: 8,
//     name: 'Max',
//     type: 'dog',
//     breed: 'German Shepherd',
//     age: '5 years',
//     ageRange: '5+',
//     location: 'San Diego, CA',
//     partner: 'paws',
//     img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80',
//     isNew: false,
//     listingType: 'sale',
//     price: 500,
//   },
//   {
//     id: 9,
//     name: 'Luna',
//     type: 'cat',
//     breed: 'Tabby Cat',
//     age: '2 years',
//     ageRange: '1-5',
//     location: 'Dallas, TX',
//     partner: 'kitty',
//     img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
//     isNew: true,
//     listingType: 'adoption',
//   },
//   {
//     id: 10,
//     name: 'Snowball',
//     type: 'small',
//     breed: 'Rabbit',
//     age: '1 year',
//     ageRange: '0-1',
//     location: 'San Jose, CA',
//     partner: 'critter',
//     img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=400&q=80',
//     isNew: false,
//     listingType: 'sale',
//     price: 80,
//   },
//   {
//     id: 11,
//     name: 'Rocky',
//     type: 'dog',
//     breed: 'Bulldog',
//     age: '4 years',
//     ageRange: '1-5',
//     location: 'Austin, TX',
//     partner: 'canine',
//     img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=400&q=80',
//     isNew: true,
//     listingType: 'adoption',
//   },
//   {
//     id: 12,
//     name: 'Shadow',
//     type: 'cat',
//     breed: 'Black Cat',
//     age: '3 years',
//     ageRange: '1-5',
//     location: 'Jacksonville, FL',
//     partner: 'kitty',
//     img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
//     isNew: true,
//     listingType: 'sale',
//     price: 300,
//   },
// ];

const PetSection = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");
  const [breed, setBreed] = useState("");
  const [sort, setSort] = useState("recent");
  const [selectedListingType, setSelectedListingType] = useState("all");
  const [page, setPage] = useState(1);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const petsPerPage = 8;

  // Fetch All pets from API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const filters = {
          type: selectedType,
          listingType: selectedListingType,
          breed: breed,
        };

        const response = await getAllPets(filters);
        setPets(response.data || []);
        // If the API returns data in a different format, adjust accordingly
        // For example, if the API returns { success: true, data: [...] }
        // then use response.data instead of response.data.data
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
        setError("Failed to load pets. Please try again later.");
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [selectedType, selectedListingType, breed]);


  





  // Sorting logic
  const sortedPets = [...pets].sort(() => {
   
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
    setSelectedListingType("all");
    setPage(1);
    setSort("recent");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 px-2 md:px-8 py-8 bg-navy min-h-screen">
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
            <h1 className="text-2xl md:text-4xl font-extrabold text-gold drop-shadow-lg mb-2">
              Find Your Forever Friend
            </h1>
            <p className="text-white text-base md:text-lg mb-4 drop-shadow">
              Thousands of loving pets are waiting for their new home. Explore
              profiles from trusted shelters and NGOs.
            </p>

            <button className="bg-gold hover:bg-accent-orange text-navy font-bold px-6 py-2 rounded-full shadow transition">
              Explore Adoptable Pets
            </button>
        
            </div>
          </section>

        {/* Tabs & Sort */}
   <div className="p-6 rounded-lg  shadow-sm border border-blue-900/10 " >
  <div className="flex flex-wrap items-center gap-3">
    {/* Pet Type Buttons */}
    {petTypes.slice(0, 4).map((type) => (
      <button
        key={`alt-${type.value}`}
        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
          selectedType === type.value
            ? "bg-yellow-400 text-blue-900 border-yellow-400"
            : "bg-white text-blue-900 border-blue-900/20 hover:bg-yellow-100"
        }`}
        onClick={() => handleTypeChange(type.value)}
      >
        {type.label}
      </button>
    ))}

    {/* Clear Button */}
    <button
      className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 bg-white text-red-500 border-red-200 hover:bg-red-50"
      onClick={handleClearFilters}
    >
      Clear All
    </button>

    {/* Search by Breed Input */}
    <div className="flex items-center gap-2 ml-auto w-full sm:w-auto sm:flex-1">
      <input
        type="text"
        placeholder="Search by breed..."
        value={breed}
        onChange={(e) => setBreed(e.target.value)}
        className="w-full sm:max-w-sm border border-blue-900/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 text-black"
      />
    </div>
        <button
              onClick={() => navigate("/add-pet")}
              className="bg-gold hover:bg-accent-orange text-navy font-bold px-6 py-2 rounded-full shadow transition"
            >
              Add New Pet
            </button>
  </div>
</div>



        {/* Pet Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-softgray py-12">
              Loading pets...
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500 py-12">
              {error}
            </div>
          ) : paginatedPets.length === 0 ? (
            <div className="col-span-full text-center text-softgray py-12">
              No pets found matching your criteria.
            </div>
          ) : (
            paginatedPets.map((pet) => (
              <div
                key={pet._id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition overflow-hidden relative group flex flex-col border-2 border-navy/10"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={pet.img}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {new Date(pet.createdAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                      <span className="absolute top-2 right-2 bg-gold text-navy text-xs font-bold px-2 py-1 rounded-full shadow">
                        New
                      </span>
                    )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1">
                        {pet.breed}
                    </h3>
                    <div className="text-sm text-softgray mb-1">
                      , {pet.age} years
                    
                    </div>
                    <div className="text-xs text-softgray mb-1">
                      {pet.location}
                    </div>
                    <div className="text-xs mt-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${pet.listingType === "adoption"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {pet.listingType === "adoption"
                          ? "Adoption"
                          : "For Sale"}
                      </span>
                      {pet.listingType === "sale" && pet.price && (
                        <span className="ml-2 text-blue-700 font-bold">
                          ${pet.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/view-pet/${pet._id}`)}
                    className="mt-4 w-full bg-gold hover:bg-accent-orange text-navy font-bold py-2 rounded-full shadow transition"
                  >
                    {pet.listingType === "adoption" ? "Adopt Me!" : "Buy Now"}
                  </button>
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
              className={`px-3 py-1 rounded-full border-2 ${page === idx + 1
                  ? "bg-gold text-navy border-gold"
                  : "bg-white hover:bg-gold/10 border-navy/10 text-navy"
                }`}
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
      </main>
    </div>
  );
};

export default PetSection;
