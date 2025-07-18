import { Link , NavLink  } from "react-router-dom"

export default function Header() {
  return (
    <header className="  bg-navy/80  shadow border border-navy/30 text-white px-6 py-2 fixed top-0 left-0 w-full z-50 transition-all duration-300 rounded-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold flex items-center gap-2 tracking-wide">
          <span className="text-3xl hover:scale-110 transition-transform duration-200"></span>
          <span className="hidden sm:inline text-gold font-serif tracking-widest">TailMate</span>
        </h1>
        {/* Navigation */}
        <nav className="flex items-center  gap-2 sm:gap-6  px-4 py-2  ">
        
          <NavLink 
            to="/"
            className={({ isActive }) =>
              `px-3 py-1 rounded-md font-semibold transition relative group ${
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
              `px-3 py-1 rounded-md font-semibold transition relative group ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                AI PetCare
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
              `px-3 py-1 rounded-md font-semibold transition relative group ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Doctor
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
              `px-3 py-1 rounded-md font-semibold transition relative group ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Marketplace
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
              `px-3 py-1 rounded-md font-semibold transition relative group ${
                isActive ? "text-gold" : "text-white hover:text-gold"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Get Pet
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
              `px-3 py-1 rounded-md font-semibold transition relative group ${
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
        </nav>
        {/* Icons */}
        <div className="flex items-center gap-4 ml-4">
          {/* Search Icon */}
          <button className="p-2 rounded-full hover:bg-navy/40 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gold">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="18" y1="18" x2="15.5" y2="15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {/* Cart Icon */}
          <button className="p-2 rounded-full hover:bg-navy/40 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gold">
              <path d="M6 6h15l-1.5 9h-13z" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="9" cy="20" r="1" fill="currentColor" />
              <circle cx="17" cy="20" r="1" fill="currentColor" />
            </svg>
          </button>
          {/* User Avatar Placeholder */}
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-lg shadow-inner border-2 border-white cursor-pointer">
            <span>U</span>
          </div>
        </div>
      </div>
    </header>
  )
}
