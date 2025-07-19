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
import Userprofile from './pages/Userprofile'
import Login from './pages/Login.jsx'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  useLenis()
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen pt-16 bg-[#191c2d]">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/aipetcare" element={
              <ProtectedRoute>
                <AiPetCare />
              </ProtectedRoute>
            }/>

            <Route path="/doctor" element={
              <ProtectedRoute>
                <Doctor />
              </ProtectedRoute>
            }/>

            <Route path="/marketplace" element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }/>

            <Route path="/petsection" element={
              <ProtectedRoute>
                <PetSection />
              </ProtectedRoute>
            } />

            <Route path="/dating" element={
              <ProtectedRoute>
                <PetDating />
              </ProtectedRoute>
            }/>

            <Route path="/help" element={<Help />} />
            <Route path="/user-profile" element={
              <ProtectedRoute>
                <Userprofile />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
