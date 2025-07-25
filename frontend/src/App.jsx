import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AiPetCare from './pages/AiPetCare'
import Doctor from './pages/Doctor'
import Marketplace from './pages/Marketplace'
import PetSection from './pages/PetSection.jsx'
import PetDating from './pages/PetDating'
import Header from './components/Header'
import Footer from './components/Footer'
import Help from './pages/Help'
import useLenis from './hooks/useLenis'
import UserProfile from './pages/UserProfile'
import Login from './pages/Login.jsx'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import CreatePetpost from './components/CreatePetpost.jsx'
import ViewPet from './components/ViewPet.jsx'
import UpdatePetForm from './components/UpdatePetForm.jsx'
import CreateDatingPetpost from './components/CreateDatingPetPost.jsx'
import ViewDatingPet from './components/ViewDatingPet.jsx'
import Chat from './components/Chat/Chat.jsx'
import ChatPage from './components/Chat/ChatPage.jsx'
import { LikeProvider } from './context/LikeContext.jsx'

export default function App() {
  useLenis();
  return (
   
      <LikeProvider>
         <AuthProvider>
        <div className="flex flex-col min-h-screen pt-16 bg-[#191c2d]">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route
                path="/aipetcare"
                element={
                  <ProtectedRoute>
                    <AiPetCare />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/doctor"
                element={
                  <ProtectedRoute>
                    <Doctor />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/petsection"
                element={
                  <ProtectedRoute>
                    <PetSection />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-pet"
                element={
                  <ProtectedRoute>
                    <CreatePetpost />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dating"
                element={
                  <ProtectedRoute>
                    <PetDating />
                  </ProtectedRoute>
                }
              />

              <Route path="/help" element={<Help />} />
              <Route
                path="/user-profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/view-pet/:petId"
                element={
                  <ProtectedRoute>
                    <ViewPet />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-pet/:petId"
                element={
                  <ProtectedRoute>
                    <UpdatePetForm />
                  </ProtectedRoute>
                }
              />

            <Route path="/create-dating-pet" element={
              <ProtectedRoute>
                <CreateDatingPetpost/>
              </ProtectedRoute>
            } />
            
            <Route path="/view-dating-pet/:petId" element={
              <ProtectedRoute>
                <ViewDatingPet />
              </ProtectedRoute>
            } />
            
            <Route path="/chat/:receiverId" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            
            <Route path="/chats" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
              
          </Routes>
        </main>
        <Footer />
      </div>
      </AuthProvider>
      </LikeProvider>
  );
}
