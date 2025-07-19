import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { currentUser, userInfo, loading, logout } = useAuth();
  
  // Format date from "Sat, 19 Jul 2025 16:56:32 GMT" to "July 2025"
  const formatJoinDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
     const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
     return `${month} ${day}, ${year}`;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] bg-navy">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }
  
  // Use auth data if available, otherwise fallback to mock data
  const [userData, setUserData] = useState({
    name: userInfo?.name || currentUser?.displayName ||
    'Alex Johnson',
    email: userInfo?.email || currentUser?.email || 'alex@example.com',
  
    joinDate: formatJoinDate(currentUser?.metadata?.creationTime) || 'January 2023',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    pets: [
      { id: 1, name: 'Max', type: 'Dog', breed: 'Golden Retriever', age: 3, image: 'https://images.unsplash.com/photo-1552053831-71594a27632d' },
      { id: 2, name: 'Luna', type: 'Cat', breed: 'Siamese', age: 2, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba' }
    ]
  });

  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="bg-navy min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative bg-navy py-16 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">My Profile</h1>
          <p className="text-xl md:text-2xl mb-8 text-gold font-medium drop-shadow">Manage your account and pets</p>
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1601758123927-195e4b9f6e0e')] bg-cover bg-center opacity-20 z-0" />
      </section>

      {/* Profile Content */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border-2 border-gold/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500">
          
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold shadow-lg">
              <img 
                src={userInfo?.picture || currentUser?.photoURL || userData.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gold">{userData.name}</h2>
              <p className="text-lg text-white/80">{userData.email}</p>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2">
                <p className="text-sm text-white/60"><span className="text-gold">Member since:</span> {userData.joinDate}</p>
              </div>
              <div className="mt-4">
               
                <button 
                  onClick={logout}
                  className="bg-red-500/70 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg transition">
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gold/30 mb-6">
            <nav className="flex flex-wrap -mb-px">
              <button 
                onClick={() => setActiveTab('profile')} 
                className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'profile' ? 'border-gold text-gold' : 'border-transparent text-white/60 hover:text-white/90'}`}
              >
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('pets')} 
                className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'pets' ? 'border-gold text-gold' : 'border-transparent text-white/60 hover:text-white/90'}`}
              >
                My Pets
              </button>
              <button 
                onClick={() => setActiveTab('matches')} 
                className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'matches' ? 'border-gold text-gold' : 'border-transparent text-white/60 hover:text-white/90'}`}
              >
                Matches
              </button>
              <button 
                onClick={() => setActiveTab('orders')} 
                className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'orders' ? 'border-gold text-gold' : 'border-transparent text-white/60 hover:text-white/90'}`}
              >
                Orders
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60">
                  <h3 className="text-xl font-bold mb-4 text-gold">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gold mb-1 text-sm">Full Name</label>
                      <input 
                        type="text" 
                        value={userData.name} 
                        className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold" 
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-gold mb-1 text-sm">Email</label>
                      <input 
                        type="email" 
                        value={userData.email} 
                        className="w-full bg-navy/50 border border-gold/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold" 
                        readOnly
                      />
                    </div>
                    
                  </div>
                </div>
                
                {/* <div className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60">
                  <h3 className="text-xl font-bold mb-4 text-gold">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <div className="w-12 h-6 bg-navy/70 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-gold absolute top-1 left-1 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS Alerts</span>
                      <div className="w-12 h-6 bg-navy/70 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white/70 absolute top-1 right-1 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Profile Privacy</span>
                      <select className="bg-navy/50 border border-gold/30 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-gold">
                        <option>Public</option>
                        <option>Friends Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                  </div>
                </div> */}
              </div>
            )}
            
            {activeTab === 'pets' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gold">My Pets</h3>
                  <button className="bg-gold hover:bg-accent-orange text-navy px-4 py-2 rounded-full font-bold text-sm shadow-lg transition">
                    Add New Pet
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.pets.map(pet => (
                    <div key={pet.id} className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60 hover:bg-gradient-to-br hover:from-navy/70 hover:to-navy/40">
                      <div className="h-48 rounded-lg overflow-hidden mb-4">
                        <img 
                          src={pet.image} 
                          alt={pet.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-xl font-bold text-gold mb-2">{pet.name}</h4>
                      <p className="mb-1"><span className="text-gold/80">Type:</span> {pet.type}</p>
                      <p className="mb-1"><span className="text-gold/80">Breed:</span> {pet.breed}</p>
                      <p className="mb-3"><span className="text-gold/80">Age:</span> {pet.age} years</p>
                      <div className="flex space-x-2">
                        <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs shadow-lg transition">
                          Edit
                        </button>
                        <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs shadow-lg transition">
                          Care Plan
                        </button>
                        <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs shadow-lg transition">
                          Dating
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Pet Card */}
                  <div className="bg-navy/30 p-6 rounded-xl border border-gold/20 border-dashed flex flex-col items-center justify-center text-center min-h-[300px] cursor-pointer hover:bg-navy/40 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                      <span className="text-3xl text-gold">+</span>
                    </div>
                    <h4 className="text-xl font-bold text-gold mb-2">Add New Pet</h4>
                    <p className="text-white/60">Register your pet to access all TailMate features</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'matches' && (
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-gold">❤️</span>
                </div>
                <h3 className="text-2xl font-bold text-gold mb-2">No Matches Yet</h3>
                <p className="text-white/60 mb-6">Start matching your pets with others to see results here</p>
                <button className="bg-gold hover:bg-accent-orange text-navy px-6 py-2 rounded-full font-bold text-sm shadow-lg transition">
                  Find Matches
                </button>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-gold">🛍️</span>
                </div>
                <h3 className="text-2xl font-bold text-gold mb-2">No Orders Yet</h3>
                <p className="text-white/60 mb-6">Your purchase history will appear here</p>
                <button className="bg-gold hover:bg-accent-orange text-navy px-6 py-2 rounded-full font-bold text-sm shadow-lg transition">
                  Visit Shop
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;