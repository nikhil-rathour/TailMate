import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getPetsByOwnerEmail } from "../services/petService";
import DeletePetButton from "../components/DeletePetButton";
import { motion } from "framer-motion";
import LikeComponent from "../components/profile/like";

const UserProfile = () => {
  const { currentUser, userInfo, loading, logout } = useAuth();
  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [petsError, setPetsError] = useState(null);

  // Get user email for fetching pets
  const ownerEmail = userInfo?.email;

  const navigate = useNavigate();

  // Fetch user's pets from API
  useEffect(() => {
    const fetchPets = async () => {
      if (!currentUser) return;

      setPetsLoading(true);
      try {
        // For testing/development, use mock data if API call fails
        const mockPets = [
          {
            _id: 1,
            name: "Max",
            type: "Dog",
            breed: "Golden Retriever",
            age: 3,
            img: "https://images.unsplash.com/photo-1552053831-71594a27632d",
          },
          {
            _id: 2,
            name: "Luna",
            type: "Cat",
            breed: "Siamese",
            age: 2,
            img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
          },
        ];

        try {
          const token = await currentUser.getIdToken();

          const response = await getPetsByOwnerEmail(ownerEmail, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response && response.data) {
            // Use the data from the response
            setPets(response.data);
          } else {
            // Fallback to mock data
            setPets(mockPets);
          }
        } catch (apiError) {
          console.warn("API call failed, using mock data:", apiError);
          setPets(mockPets);
        }

        setPetsError(null);
      } catch (error) {
        console.error("Error in pet data handling:", error);
        setPetsError("Failed to load pets");
      } finally {
        setPetsLoading(false);
      }
    };

    fetchPets();
  }, [currentUser]);

  // Format date from "Sat, 19 Jul 2025 16:56:32 GMT" to "July 2025"
  const formatJoinDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };



  // Use auth data if available, otherwise fallback to mock data
  const [userData, setUserData] = useState({
    name: userInfo?.name || currentUser?.displayName || "Alex Johnson",
    email: userInfo?.email || currentUser?.email || "alex@example.com",

    joinDate:
      formatJoinDate(currentUser?.metadata?.creationTime) || "January 2023",
    profileImage:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  });

  const [activeTab, setActiveTab] = useState("pets");
  const [showAddPetPopup, setShowAddPetPopup] = useState(false);

  const handleAddPetClick = () => {
    setShowAddPetPopup(true);
  };

  const handlePopupClose = () => {
    setShowAddPetPopup(false);
  };

  const navigateToAddPet = (isDating) => {
    if (isDating) {
      navigate("/create-dating-pet");
    } else {
      navigate("/add-pet");
    }
    setShowAddPetPopup(false);
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] bg-navy">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-navy min-h-screen text-white">
        {/* Hero Section */}
        <section className="relative bg-navy py-16 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              My Profile
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gold font-medium drop-shadow">
              Manage your account and pets
            </p>
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
                  src={
                    userInfo?.picture ||
                    currentUser?.photoURL ||
                    userData.profileImage
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gold">
                  {userData.name}
                </h2>
                <p className="text-lg text-white/80">{userData.email}</p>
                <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2">
                  <p className="text-sm text-white/60">
                    <span className="text-gold">Member since:</span>{" "}
                    {userData.joinDate}
                  </p>
                </div>
                <div className="mt-4 ">
                  <button
                    onClick={handleAddPetClick}
                    className="bg-gold mr-4 hover:bg-accent-orange text-navy px-6 py-2 rounded-full font-bold text-sm shadow-lg transition"
                  >
                    Add New Pet
                  </button>

                  <button
                    onClick={logout}
                    className="bg-red-500/70 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gold/30 mb-6">
              <nav className="flex flex-wrap -mb-px">
                <button
                  onClick={() => setActiveTab("pets")}
                  className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${
                    activeTab === "pets"
                      ? "border-gold text-gold"
                      : "border-transparent text-white/60 hover:text-white/90"
                  }`}
                >
                  My Pets
                </button>
                <button
                  onClick={() => setActiveTab("matches")}
                  className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${
                    activeTab === "matches"
                      ? "border-gold text-gold"
                      : "border-transparent text-white/60 hover:text-white/90"
                  }`}
                >
                  Matches
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${
                    activeTab === "orders"
                      ? "border-gold text-gold"
                      : "border-transparent text-white/60 hover:text-white/90"
                  }`}
                >
                  Orders
                </button>

                <button
                  onClick={() => setActiveTab("likes")}
                  className={`mr-4 py-2 px-4 font-medium text-sm border-b-2 ${
                    activeTab === "likes"
                      ? "border-gold text-gold"
                      : "border-transparent text-white/60 hover:text-white/90"
                  }`}
                >
                  My Likes
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "pets" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gold">My Pets</h3>
                  </div>

                  {petsLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                    </div>
                  ) : petsError ? (
                    <div className="text-center py-12">
                      <p className="text-red-400 mb-4">{petsError}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-gold hover:bg-accent-orange text-navy px-4 py-2 rounded-full font-bold text-sm shadow-lg transition"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pets.length > 0 ? (
                        pets.map((pet) => (
                          <div
                            key={pet._id || pet.id}
                            className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60 hover:bg-gradient-to-br hover:from-navy/70 hover:to-navy/40"
                          >
                            <div
                              onClick={() => {
                                if (pet.isDating) {
                                  navigate(`/view-dating-pet/${pet._id}`);
                                } else {
                                  navigate(`/view-pet/${pet._id}`);
                                }
                              }}
                              className="h-48 rounded-lg overflow-hidden mb-4 relative"
                            >
                              <img
                                src={
                                  pet.img ||
                                  pet.image ||
                                  "https://images.unsplash.com/photo-1552053831-71594a27632d"
                                }
                                alt={pet.name}
                                className="w-full h-full object-cover"
                              />

                              {/* Label based on isDating condition */}
                              {pet.isDating ? (
                                <span className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-red-400 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                                  For Dating
                                </span>
                              ) : (
                                <span
                                  className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full z-10 ${
                                    pet.listingType === "adoption"
                                      ? "bg-green-500/90 text-white"
                                      : "bg-blue-500/90 text-white"
                                  }`}
                                >
                                  {pet.listingType === "adoption"
                                    ? "For Adoption"
                                    : "For Sale"}
                                </span>
                              )}
                            </div>

                            <h4 className="text-xl font-bold text-gold mb-2">
                              {pet.name}
                            </h4>
                            <p className="mb-1">
                              <span className="text-gold/80">Type:</span>{" "}
                              {pet.type}
                            </p>
                            <p className="mb-1">
                              <span className="text-gold/80">Breed:</span>{" "}
                              {pet.breed}
                            </p>
                            <p className="mb-3">
                              <span className="text-gold/80">Age:</span>{" "}
                              {pet.age} weeks old
                            </p>

                            <div className="flex space-x-2">
                              <button
                                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs shadow-lg transition"
                                onClick={() =>
                                  navigate(`/update-pet/${pet._id}`)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs shadow-lg transition"
                                onClick={() => navigate(`/view-pet/${pet._id}`)}
                              >
                                View More
                              </button>

                              <DeletePetButton
                                petId={pet._id}
                                petName={pet.name}
                                onDelete={() =>
                                  setPets((pets) =>
                                    pets.filter((p) => p._id !== pet._id)
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8">
                          <p className="text-white/60 mb-4">
                            You haven't added any pets yet
                          </p>
                        </div>
                      )}

                      {/* Add Pet Card */}
                      <div className="bg-navy/30 p-6 rounded-xl border border-gold/20 border-dashed flex flex-col items-center justify-center text-center min-h-[300px] cursor-pointer hover:bg-navy/40 transition-all duration-300">
                        <div
                          onClick={handleAddPetClick}
                          className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4"
                        >
                          <span className="text-3xl text-gold">+</span>
                        </div>
                        <h4 className="text-xl font-bold text-gold mb-2">
                          Add New Pet
                        </h4>
                        <p className="text-white/60">
                          Register your pet to access all TailMate features
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "matches" && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl text-gold">❤️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gold mb-2">
                    No Matches Yet
                  </h3>
                  <p className="text-white/60 mb-6">
                    Start matching your pets with others to see results here
                  </p>
                  <button className="bg-gold hover:bg-accent-orange text-navy px-6 py-2 rounded-full font-bold text-sm shadow-lg transition">
                    Find Matches
                  </button>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl text-gold">🛍️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gold mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-white/60 mb-6">
                    Your purchase history will appear here
                  </p>
                  <button className="bg-gold hover:bg-accent-orange text-navy px-6 py-2 rounded-full font-bold text-sm shadow-lg transition">
                    Visit Shop
                  </button>
                </div>
              )}

              {activeTab === "likes" && (
                <LikeComponent/>
              )}
            </div>
          </div>
        </section>
      </div>

      <div>
        {/* Add Pet Popup */}
        {showAddPetPopup && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border-2 border-gold/30"
            >
              <h3 className="text-2xl font-bold text-gold mb-6 text-center">
                Add Your Pet
              </h3>
              <p className="text-white/80 mb-8 text-center">
                What type of listing would you like to create?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => navigateToAddPet(false)}
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg"
                >
                  <span className="text-3xl">🏠</span>
                  <span className="font-bold">For Sale/Adoption</span>
                  <span className="text-xs text-white/80">
                    Find a new home for your pet
                  </span>
                </button>

                <button
                  onClick={() => navigateToAddPet(true)}
                  className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg"
                >
                  <span className="text-3xl">❤️</span>
                  <span className="font-bold">Pet Dating</span>
                  <span className="text-xs text-white/80">
                    Find a match for your pet
                  </span>
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={handlePopupClose}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
