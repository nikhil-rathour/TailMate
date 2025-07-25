import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPetById } from '../services/petService';
import { getPetsByOwnerEmail } from "../services/petService"
import { useAuth } from "../context/AuthContext"
import DeletePetButton from "./DeletePetButton";
import { UseLike } from '../context/LikeContext';
import { createLike, deleteLike, getAllLikePosts } from '../utils/like.utils';
import toast from 'react-hot-toast';
import { FiHeart } from 'react-icons/fi';


const ViewPet = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
  
  const { petId } = useParams();
  
  const [pet, setPet] = useState(null);
  const [petLoading, setPetLoading] = useState(false);
  const [petError, setPetError] = useState(null);
  const [ownerPets, setOwnerPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [petsError, setPetsError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const {likes,setLikes} = UseLike()
  const {userInfo} = useAuth()

  const isLiked = likes.some((like) => like.postId._id === petId);
    

  useEffect(() => {
    const fetchPet = async () => {
      setPetLoading(true);
      try {
        const response = await getPetById(petId);
        setPet(response);
        
        // Check if current user is the owner
        if (currentUser && response?.data?.ownerEmail === currentUser.email) {
          setIsOwner(true);
        }
      } catch (error) {
        setPetError(error.message);
      } finally {
        setPetLoading(false);
      }
    };

    fetchPet();
  }, [petId, currentUser]);


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
           setOwnerPets(response.data);
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

    async function getLikeData(id) {
    const res = await getAllLikePosts(id);
    console.log(res);
    setLikes(res.data);
  }

    const handleLike = async (id, isLiked) => {
    if (isLiked) {
      const res = await deleteLike(userInfo._id, id);
    res.success?  toast.success(res.message) : toast.error(res.message);
      console.log("post res", res);
    } else {
      const res = await createLike(userInfo._id, id);
    res.success?  toast.success(res.message) : toast.error(res.message);
      console.log("post res", res);
    }

    getLikeData(userInfo._id);
  };


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
              
              <div className="flex flex-wrap gap-3 mt-4">
                {currentUser && pet?.data?.ownerEmail && currentUser.email === pet.data.ownerEmail ? (
                  <>
                    <button
                      onClick={() => navigate(`/update-pet/${pet.data._id}`)}
                      className="bg-gold hover:bg-accent-orange text-navy px-6 py-2 rounded-full font-bold shadow-lg transition flex-1"
                    >
                      Edit Pet
                    </button>
                    <DeletePetButton
                      petId={pet.data._id}
                      petName={pet.data.name}
                      onDelete={() => navigate('/petsection')}
                    />
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        if (!currentUser) {
                          navigate('/login');
                          return;
                        }
                        
                        const receiverId = pet.data.ownerEmail.split('@')[0];
                        let receiverName = 'Pet Owner';
                        let receiverImage = 'https://via.placeholder.com/150';
                        
                        try {
                          if (typeof pet.data.ownerData === 'string') {
                            const ownerData = JSON.parse(pet.data.ownerData);
                            receiverName = ownerData?.name || 'Pet Owner';
                            receiverImage = ownerData?.picture || 'https://via.placeholder.com/150';
                          } else if (pet.data.ownerData) {
                            receiverName = pet.data.ownerData.name || 'Pet Owner';
                            receiverImage = pet.data.ownerData.picture || 'https://via.placeholder.com/150';
                          }
                        } catch (err) {
                          console.error('Error parsing owner data:', err);
                        }
                        
                        navigate(`/chat/${receiverId}`, { 
                          state: { 
                            receiverId, 
                            receiverName,
                            receiverImage,
                            petId: pet.data._id,
                            petName: pet.data.name,
                            petImage: pet.data.img
                          }
                        });
                      }}
                      className="bg-gold hover:bg-accent-orange text-navy px-6 py-2 rounded-full font-bold shadow-lg transition flex-1"
                    >
                      Connect With Owner
                    </button>
                    <button onClick={() => handleLike(petId,isLiked)} className="bg-white hover:bg-beige text-navy px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition">
                      <FiHeart className={`${isLiked ? 'text-gold fill-red-600' : 'text-navy'} w-5 h-5`} />
                      <span className="font-bold">{isLiked ? 'Unsave' : 'Save'}</span>
                    </button>
                  </>
                )}
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
            <h2 className="text-2xl font-bold mb-4 text-gold">{isOwner ? 'Your Pet Listing' : 'Owner'}</h2>
            {isOwner ? (
              <div className="space-y-4">
                <div className="p-4 bg-navy/70 rounded-xl">
                  <p className="text-gold font-medium">This is your pet listing</p>
                  <p className="text-softgray text-sm mt-1">You can edit or delete this listing using the buttons above</p>
                </div>
                <div className="p-4 bg-navy/70 rounded-xl">
                  <h3 className="text-gold font-medium mb-2">Listing Statistics</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-softgray">Views</p>
                      <p className="font-semibold">--</p>
                    </div>
                    <div>
                      <p className="text-softgray">Saved</p>
                      <p className="font-semibold">--</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-lightgray overflow-hidden">
                    <img 
                      src={typeof pet.data.ownerData === 'string' ? JSON.parse(pet.data.ownerData)?.picture : pet.data.ownerData?.picture || 'https://via.placeholder.com/150'} 
                      alt={typeof pet.data.ownerData === 'string' ? JSON.parse(pet.data.ownerData)?.name : pet.data.ownerData?.name || 'Pet Owner'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{typeof pet.data.ownerData === 'string' ? JSON.parse(pet.data.ownerData)?.name : pet.data.ownerData?.name || 'Pet Owner'}</p>
                    <p className="text-softgray text-sm">{pet.data.ownerEmail || 'N/A'}</p>
                  </div>
                </div>
                <button className="w-full bg-gold hover:bg-accent-orange text-navy px-4 py-2 rounded-full font-bold shadow-lg transition">View Profile</button>
              </>
            )}
          </div>
        </div>
        
        {/* Owner's Other Pets Section */}
        <div className="bg-navy/50 rounded-3xl shadow-xl p-6 border-2 border-navy/20">
          <h2 className="text-2xl font-bold mb-6 text-gold">{isOwner ? 'Your Other Listings' : 'Owner\'s Other Pets'}</h2>
          
          {petsLoading ? (
            <div className="text-center py-4">
              <p className="text-softgray">Loading pets...</p>
            </div>
          ) : petsError ? (
            <div className="text-center py-4">
              <p className="text-red-400">{petsError}</p>
            </div>
          ) : ownerPets && ownerPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {ownerPets.filter(ownerPet => ownerPet._id !== pet.data._id).map((ownerPet) => (
                <Link to={`/view-pet/${ownerPet._id}`} key={ownerPet._id} className="bg-navy/70 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
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
                    {isOwner && (
                      <div className="mt-2 flex justify-end">
                        <Link to={`/update-pet/${ownerPet._id}`} className="text-gold text-sm hover:underline">Edit</Link>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-softgray">{isOwner ? 'You have no other pet listings' : 'No other pets from this owner'}</p>
              {isOwner && (
                <Link to="/add-pet" className="inline-block mt-4 bg-gold hover:bg-accent-orange text-navy px-4 py-2 rounded-full font-bold shadow-lg transition">
                  Add New Pet
                </Link>
              )}
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