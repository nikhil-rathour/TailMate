import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ChatList from "./Chat/ChatList";
import { useState } from "react";
import { useLiquidGlass } from "../context/LiquidGlassContext";

export default function Header() {
  const { currentUser, userInfo, logout } = useAuth();
  const { isEnabled, toggle } = useLiquidGlass();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="bg-navy/80 shadow border border-navy/30 text-white px-4 sm:px-6 py-2 fixed top-0 left-0 w-full z-50 transition-all duration-300 rounded-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 tracking-wide text-gold">
          T A I L M A T E
        </h1>
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-navy/40 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4 px-2">
        
          <NavLink 
            to="/"
            className={({ isActive }) =>
              `px-2 lg:px-3 py-1 rounded-md font-semibold transition relative group text-sm lg:text-base ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Home
                <span
                  className={`absolute left-1/2 -bottom-1 h-0.5 bg-gold rounded-full transition-all duration-300 transform -translate-x-1/2 ${
                    isActive ? "w-2/3" : "w-0 group-hover:w-2/3"
                  }`}
                ></span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/aipetcare"
            className={({ isActive }) =>
              `px-2 lg:px-3 py-1 rounded-md font-semibold transition relative group text-sm lg:text-base ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                AI Care
                <span
                  className={`absolute left-1/2 -bottom-1 h-0.5 bg-gold rounded-full transition-all duration-300 transform -translate-x-1/2 ${
                    isActive ? "w-2/3" : "w-0 group-hover:w-2/3"
                  }`}
                ></span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/doctor"
            className={({ isActive }) =>
              `px-2 lg:px-3 py-1 rounded-md font-semibold transition relative group text-sm lg:text-base ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Vet Zone
                <span
                  className={`absolute left-1/2 -bottom-1 h-0.5 bg-gold rounded-full transition-all duration-300 transform -translate-x-1/2 ${
                    isActive ? "w-2/3" : "w-0 group-hover:w-2/3"
                  }`}
                ></span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              `px-2 lg:px-3 py-1 rounded-md font-semibold transition relative group text-sm lg:text-base ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Market
                <span
                  className={`absolute left-1/2 -bottom-1 h-0.5 bg-gold rounded-full transition-all duration-300 transform -translate-x-1/2 ${
                    isActive ? "w-2/3" : "w-0 group-hover:w-2/3"
                  }`}
                ></span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/petsection"
            className={({ isActive }) =>
              `px-2 lg:px-3 py-1 rounded-md font-semibold transition relative group text-sm lg:text-base ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Pets
                <span
                  className={`absolute left-1/2 -bottom-1 h-0.5 bg-gold rounded-full transition-all duration-300 transform -translate-x-1/2 ${
                    isActive ? "w-2/3" : "w-0 group-hover:w-2/3"
                  }`}
                ></span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/dating"
            className={({ isActive }) =>
              `px-2 lg:px-3 py-1 rounded-md font-semibold transition relative group text-sm lg:text-base ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Dating
                <span
                  className={`absolute left-1/2 -bottom-1 h-0.5 bg-gold rounded-full transition-all duration-300 transform -translate-x-1/2 ${
                    isActive ? "w-2/3" : "w-0 group-hover:w-2/3"
                  }`}
                ></span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/owner-dating"
            className={({ isActive }) =>
              `px-2 lg:px-3 py-1 rounded-md font-semibold transition relative group text-sm lg:text-base ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Bonded by Fur
                <span
                  className={`absolute left-1/2 -bottom-1 h-0.5 bg-gold rounded-full transition-all duration-300 transform -translate-x-1/2 ${
                    isActive ? "w-2/3" : "w-0 group-hover:w-2/3"
                  }`}
                ></span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <button 
            onClick={toggle}
            className={`p-2 rounded-full transition ${isEnabled ? 'bg-gold/20 text-gold' : 'hover:bg-navy/40 text-white'}`}
            title="Toggle Liquid Glass"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </button>
          {currentUser && <ChatList />}


          {currentUser ? (
            <div className="relative group">
              <Link to="/user-profile" 
                className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-sm lg:text-lg shadow-inner border-2 border-white cursor-pointer overflow-hidden">
                {userInfo?.picture ? (
                  <img src={userInfo.picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{userInfo?.name?.charAt(0) || currentUser.email?.charAt(0) || "U"}</span>
                )}
              </Link>
              <div className="absolute right-0 mt-2 w-48 bg-navy/90 rounded-md shadow-lg py-1 z-50 invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100 border border-gold/30">
                <Link to="/user-profile" className="block px-4 py-2 text-sm text-white hover:bg-navy/50">
                  Profile
                </Link>
                <button 
                  onClick={() => logout()}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-navy/50"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" 
              className="px-3 lg:px-4 py-1 bg-gold text-navy rounded-full font-semibold hover:bg-gold/80 transition-colors text-sm lg:text-base"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile User Avatar */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={toggle}
            className={`p-2 rounded-full transition ${isEnabled ? 'bg-gold/20 text-gold' : 'hover:bg-navy/40 text-white'}`}
            title="Toggle Liquid Glass"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </button>
          {currentUser && <ChatList />}
          {currentUser ? (
            <Link to="/user-profile" 
              className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-sm shadow-inner border-2 border-white cursor-pointer overflow-hidden">
              {userInfo?.picture ? (
                <img src={userInfo.picture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{userInfo?.name?.charAt(0) || currentUser.email?.charAt(0) || "U"}</span>
              )}
            </Link>
          ) : (
            <Link to="/login" 
              className="px-3 py-1 bg-gold text-navy rounded-full font-semibold hover:bg-gold/80 transition-colors text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-navy/95 border-t border-gold/30 py-4">
          <nav className="flex flex-col space-y-2 px-6">
            <NavLink to="/" className="py-2 text-white hover:text-gold transition" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/aipetcare" className="py-2 text-white hover:text-gold transition" onClick={() => setIsMobileMenuOpen(false)}>AI PetCare</NavLink>
            <NavLink to="/doctor" className="py-2 text-white hover:text-gold transition" onClick={() => setIsMobileMenuOpen(false)}>Doctor</NavLink>
            <NavLink to="/marketplace" className="py-2 text-white hover:text-gold transition" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</NavLink>
            <NavLink to="/petsection" className="py-2 text-white hover:text-gold transition" onClick={() => setIsMobileMenuOpen(false)}>Get Pet</NavLink>
            <NavLink to="/dating" className="py-2 text-white hover:text-gold transition" onClick={() => setIsMobileMenuOpen(false)}>Dating</NavLink>
            <NavLink to="/owner-dating" className="py-2 text-white hover:text-gold transition" onClick={() => setIsMobileMenuOpen(false)}>Owners Dating</NavLink>
            {currentUser && (
              <>
                <hr className="border-gold/30 my-2" />
                <Link to="/user-profile" className="py-2 text-white hover:text-gold transition" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="py-2 text-left text-white hover:text-gold transition">Sign out</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
