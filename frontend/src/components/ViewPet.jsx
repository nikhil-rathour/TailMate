import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPetById } from '../services/petService';
import { getPetsByOwnerEmail } from "../services/petService"
import { useAuth } from "../context/AuthContext"


const ViewPet = () => {
    const { currentUser } = useAuth();
  
  const { petId } = useParams();
  
  const [pet, setPet] = useState(null);
  const [petLoading, setPetLoading] = useState(false);
  const [petError, setPetError] = useState(null);
   const [OwenerPets, setOwenerPets] = useState([]);
    const [petsLoading, setPetsLoading] = useState(false);
    const [petsError, setPetsError] = useState(null);
    

  useEffect(() => {
    const fetchPet = async () => {
      setPetLoading(true);
      try {
        const response = await getPetById(petId);
        setPet(response);
      } catch (error) {
        setPetError(error.message);
      } finally {
        setPetLoading(false);
      }
    };

    fetchPet();
  }, [petId]);


 // owners all posts 
  useEffect(() => {
     const fetchPets = async () => {
       if (!pet || !pet.data || !pet.data.ownerEmail) return;
       
       setPetsLoading(true);
       try {
         const token = await currentUser?.getIdToken();
         
         const response = await getPetsByOwnerEmail(pet.data.ownerEmail, {
           headers: { Authorization: `Bearer ${token}` }
         });
         
         if (response && response.data) {
           // Check if owner has only one pet (the current one)
           const otherPets = response.data.filter(p => p._id !== pet.data._id);
           if (otherPets.length === 0) {
             setPetsError('Owner only has one pet');
           }
           setOwenerPets(response.data);
         }
       } catch (error) { 
         console.error('Error fetching owner pets:', error);
         setPetsError('Failed to load owner\'s pets');
       } finally {
         setPetsLoading(false);
       }
     };
     
     fetchPets();
   }, [pet, currentUser]);

   console.log(pet);
   
   
   




  if (petLoading) {
    return (
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <div className="text-gold text-2xl">Loading pet details...</div>
      </div>
    );
  }

  if (petError) {
    return (
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-2xl">Error: {petError}</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <div className="text-gold text-2xl">Pet not found</div>
      </div>
    );
  }
  

  return (
    <div className="bg-navy min-h-screen text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Pet Header Section */}
        <div className="bg-navy/50 rounded-3xl shadow-xl p-6 mb-8 border-2 border-navy/20">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Pet Image */}
            <div className="w-full md:w-1/2 h-80 rounded-2xl overflow-hidden">
              <img 
                src={pet?.data.img || 'https://images.unsplash.com/photo-1601758123927-195e4b9f6e0e'} 
                alt={pet?.data.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Pet Info */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-4xl font-extrabold text-gold">{pet?.data.name}</h1>
                  <div className="flex gap-2">
                    <span className="bg-gold text-navy px-4 py-1 rounded-full font-bold">{pet?.data.type}</span>
                    <span className={`${pet?.data.listingType === 'sale' ? 'bg-green-500' : 'bg-blue-500'} text-white px-4 py-1 rounded-full font-bold`}>
                      {pet?.data.listingType === 'sale' ? 'For Sale' : 'For Adoption'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-softgray">Breed</p>
                    <p className="font-semibold">{pet?.data.breed}</p>
                  </div>
                  <div>
                    <p className="text-softgray">Age</p>
                    <p className="font-semibold">{pet?.data.age} years</p>
                  </div>
                  <div>
                    <p className="text-softgray">Gender</p>
                    <p className="font-semibold">{pet?.data.gender}</p>
                  </div>
                  <div>
                    <p className="text-softgray">Location</p>
                    <p className="font-semibold">{pet?.data.location}</p>
                  </div>
                  <div>
                    <p className="text-softgray">Listed On</p>
                    <p className="font-semibold">{pet?.data.createdAt ? new Date(pet.data.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-x-4">
                <button className="bg-gold hover:bg-accent-orange text-navy px-6 py-2 rounded-full font-bold shadow-lg transition">Contact Owner</button>
                <button className="bg-white hover:bg-beige text-navy px-6 py-2 rounded-full font-bold shadow-lg transition">Save Pet</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pet Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div className="md:col-span-2 bg-navy/50 rounded-3xl shadow-xl p-6 border-2 border-navy/20">
            <h2 className="text-2xl font-bold mb-4 text-gold">About {pet.name}</h2>
            <p className="text-softgray mb-4">{pet?.data.description || 'No description provided.'}</p>
            
            <h3 className="text-xl font-bold mb-2 text-gold">Personality</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {pet.personality?.map((trait, idx) => (
                <span key={idx} className="bg-beige text-navy px-3 py-1 rounded-full text-sm font-medium">{trait}</span>
              )) || <span className="text-softgray">No personality traits listed</span>}
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-gold">Health</h3>
            <ul className="list-disc list-inside text-softgray">
              <li>Vaccinated: {pet.vaccinated ? 'Yes' : 'No'}</li>
              <li>Neutered/Spayed: {pet.neutered ? 'Yes' : 'No'}</li>
              <li>Health Issues: {pet.healthIssues?.join(', ') || 'None reported'}</li>
            </ul>
          </div>
          
          {/* Owner Info */}
          <div className="bg-navy/50 rounded-3xl shadow-xl p-6 border-2 border-navy/20">
            <h2 className="text-2xl font-bold mb-4 text-gold">Owner</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-lightgray overflow-hidden">
                <img 
                  src={pet.data.ownerData?.picture || 'https://via.placeholder.com/150'} 
                  alt={pet.data.ownerData?.name || 'Pet Owner'} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-lg">{pet.data.ownerData?.name || 'Pet Owner'}</p>
                <p className="text-softgray text-sm">{pet.data.ownerData?.email || 'N/A'}</p>
              </div>
            </div>
            <button className="w-full bg-gold hover:bg-accent-orange text-navy px-4 py-2 rounded-full font-bold shadow-lg transition">View Profile</button>
          </div>
        </div>
        
        {/* Owner's Other Pets Section */}
        <div className="bg-navy/50 rounded-3xl shadow-xl p-6 border-2 border-navy/20">
          <h2 className="text-2xl font-bold mb-6 text-gold">Owner's Other Pets</h2>
          
          {petsLoading ? (
            <div className="text-center py-4">
              <p className="text-softgray">Loading pets...</p>
            </div>
          ) : petsError ? (
            <div className="text-center py-4">
              <p className="text-red-400">{petsError}</p>
            </div>
          ) : OwenerPets && OwenerPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {OwenerPets.filter(ownerPet => ownerPet._id !== pet.data._id).map((ownerPet) => (
                <Link to={`/pets/${ownerPet._id}`} key={ownerPet._id} className="bg-navy/70 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
                  <div className="h-40 bg-lightgray">
                    <img 
                      src={ownerPet.img || 'https://images.unsplash.com/photo-1601758123927-195e4b9f6e0e'} 
                      alt={ownerPet.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold">{ownerPet.name}</h3>
                    <p className="text-softgray text-sm">{ownerPet.breed} • {ownerPet.age} years</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-softgray">No other pets from this owner</p>
            </div>
          )}
        </div>
        
        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link to="/">
            <button className="bg-white hover:bg-beige text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}





export default ViewPet