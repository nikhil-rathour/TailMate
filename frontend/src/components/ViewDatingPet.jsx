import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiActivity, FiHeart, FiMail, FiUser } from 'react-icons/fi';
import { getDatingPetById, getDatingPetsByOwnerEmail } from '../services/petDatingService';
import { useAuth } from "../context/AuthContext";
import DeletePetButton from './DeletePetButton';

const ViewDatingPet = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ownerPets, setOwnerPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [petsError, setPetsError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const response = await getDatingPetById(petId);
        setPet(response.data);
        
        // Check if current user is the owner
        if (currentUser && response.data?.ownerEmail === currentUser.email) {
          setIsOwner(true);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch pet details:', err);
        setError('Failed to load pet details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (petId) {
      fetchPet();
    }
  }, [petId, currentUser]);
  
  // Fetch owner's other pets
  useEffect(() => {
    const fetchOwnerPets = async () => {
      if (!pet || !pet.ownerEmail) return;
      
      setPetsLoading(true);
      try {
        const response = await getDatingPetsByOwnerEmail(pet.ownerEmail);
        
        if (response && response.data) {
          // Filter out current pet and only show dating pets
          const otherDatingPets = response.data.filter(p => 
            p._id !== pet._id && p.isDating === true
          );
          
          setOwnerPets(otherDatingPets);
        }
      } catch (error) { 
        console.error('Error fetching owner pets:', error);
        setPetsError('Failed to load owner\'s pets');
      } finally {
        setPetsLoading(false);
      }
    };
    
    fetchOwnerPets();
  }, [pet]);

  if (loading) {
    return (
      <div className="bg-navy min-h-screen text-white py-16 px-4 flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-gold rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-r-4 border-l-4 border-gold/30 rounded-full animate-spin absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="bg-navy min-h-screen text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/dating')}
            className="flex items-center gap-2 text-gold hover:text-accent-orange transition-all duration-300 mb-8"
          >
            <FiArrowLeft /> Back to Pet Dating
          </button>
          
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg mb-6 text-center">
            {error || "Pet not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dating')}
          className="flex items-center gap-2 text-gold hover:text-accent-orange transition-all duration-300 mb-8"
        >
          <FiArrowLeft /> Back to Pet Dating
        </button>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500"
        >
          <div className="h-80 overflow-hidden relative">
            <img 
              src={pet.img} 
              alt={pet.name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/800x400?text=Pet';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h1 className="text-4xl font-bold text-white mb-2">{pet.name}</h1>
              <div className="flex items-center gap-2 text-gold">
                <span className="bg-gold/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {pet.breed}
                </span>
                <span className="bg-gold/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {pet.gender}
                </span>
                <span className="bg-gold/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {pet.age} weeks old
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-4 text-gold">About {pet.name}</h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {pet.description || pet.desc}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-white/70">
                    <FiMapPin className="text-gold" /> 
                    <span>{pet.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <FiActivity className="text-gold" /> 
                    <span>Age: {pet.age} weeks old</span>
                  </div>
                </div>
                
                {/* Owner Information */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gold/10 mb-8">
                  <h3 className="text-xl font-bold mb-4 text-gold">{isOwner ? 'Your Pet Listing' : 'Owner Information'}</h3>
                  
                  {isOwner ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-navy/70 rounded-xl">
                        <p className="text-gold font-medium">This is your pet listing</p>
                        <p className="text-white/60 text-sm mt-1">You can edit or delete this listing</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-navy/70 overflow-hidden flex items-center justify-center border border-gold/20">
                        {pet.ownerData ? (
                          <img 
                            src={typeof pet.ownerData === 'string' ? JSON.parse(pet.ownerData)?.picture : pet.ownerData?.picture || 'https://via.placeholder.com/150'} 
                            alt={typeof pet.ownerData === 'string' ? JSON.parse(pet.ownerData)?.name : pet.ownerData?.name || 'Pet Owner'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="text-3xl text-gold" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gold">
                          {typeof pet.ownerData === 'string' ? JSON.parse(pet.ownerData)?.name : pet.ownerData?.name || 'Pet Owner'}
                        </p>
                        <p className="text-white/60 text-sm">{pet.ownerEmail || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {!isOwner && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300"
                      >
                        <FiHeart /> Match with {pet.name}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (!currentUser) {
                            navigate('/login');
                            return;
                          }
                          
                          const receiverId = pet.ownerEmail.split('@')[0];
                          let receiverName = 'Pet Owner';
                          let receiverImage = 'https://via.placeholder.com/150';
                          
                          try {
                            if (typeof pet.ownerData === 'string') {
                              const ownerData = JSON.parse(pet.ownerData);
                              receiverName = ownerData?.name || 'Pet Owner';
                              receiverImage = ownerData?.picture || 'https://via.placeholder.com/150';
                            } else if (pet.ownerData) {
                              receiverName = pet.ownerData.name || 'Pet Owner';
                              receiverImage = pet.ownerData.picture || 'https://via.placeholder.com/150';
                            }
                          } catch (err) {
                            console.error('Error parsing owner data:', err);
                          }
                          
                          navigate(`/chat/${receiverId}`, { 
                            state: { 
                              receiverId, 
                              receiverName,
                              receiverImage,
                              petId: pet._id,
                              petName: pet.name,
                              petImage: pet.img
                            }
                          });
                        }}
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300"
                      >
                        <FiMail /> Contact Owner
                      </motion.button>
                    </>
                  )}
                  
                  {isOwner && (
                   <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/update-pet/${pet._id}`)}
                      className="bg-gold hover:bg-accent-orange text-navy px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300"
                    >
                      Edit Pet
                      
                    </motion.button>

                        <DeletePetButton
                      petId={pet._id}
                      petName={pet.name}
                      onDelete={() => navigate('/dating')}
                    />

                   </>
                    

                    
                  )}

                  
                </div>
                
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gold/10">
                  <h3 className="text-xl font-bold mb-4 text-gold">Compatibility</h3>
                  <div className="space-y-4">
                    {[
                      { trait: 'Friendliness', value: 85 },
                      { trait: 'Energy', value: pet.age < 3 ? 90 : pet.age < 7 ? 60 : 30 },
                      { trait: 'Training', value: 70 },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-white/80">{item.trait}</span>
                          <span className="text-gold">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1, delay: 0.3 + (idx * 0.2) }}
                            className="h-full bg-gradient-to-r from-gold to-accent-orange"
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Owner's Other Dating Pets */}
            {!petsLoading && ownerPets.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-gold">{isOwner ? 'Your Other Dating Pets' : 'Owner\'s Other Dating Pets'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {ownerPets.map((ownerPet) => (
                    <Link to={`/view-dating-pet/${ownerPet._id}`} key={ownerPet._id} className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-300">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={ownerPet.img} 
                          alt={ownerPet.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/400x300?text=Pet';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gold">{ownerPet.name}</h4>
                        <p className="text-white/60 text-sm">{ownerPet.breed} • {ownerPet.age} weeks old</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewDatingPet;