import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AiPetCare from './pages/AiPetCare'
import Doctor from './pages/Doctor'
import Marketplace from './pages/Marketplace'
import PetSection from   './pages/PetSection'
import PetDating from './pages/PetDating'
import Header from './components/Header'
import Footer from './components/Footer'
import Help from './pages/Help'
import useLenis from './hooks/useLenis'

export default function App() {
  useLenis()
  return (
    
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aipetcare" element={<AiPetCare />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/petsection" element={<PetSection/>} />
            <Route path="/dating" element={<PetDating />} />
            <Route path="/help" element={<Help/>} />


          </Routes>
        </main>
        <Footer />
      </div>
    
  )
}
