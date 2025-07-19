import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      // Send to backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND}api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        throw new Error("Failed to authenticate with server");
      }

      const data = await res.json();
      console.log("Backend response:", data);
      
      // Redirect to home page after successful login
      navigate("/");
    } catch (err) {
      console.error("Login error", err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy min-h-screen text-white relative">
      {/* Background blur overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-navy/70 z-0"></div>
      {/* Hero Section */}
      <section className="relative bg-transparent h-[80vh] flex items-center justify-center overflow-hidden z-10">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Welcome to TailMate</h1>
          <p className="text-xl md:text-2xl mb-8 text-gold font-medium drop-shadow">Sign in to connect with the pet community</p>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-2 border-gold/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500 max-w-md w-full">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-xl mb-6 text-center">
                {error}
              </div>
            )}
            
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-navy"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.677-4.198-2.707-6.735-2.707-5.523 0-10 4.477-10 10s4.477 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.087z" fill="currentColor"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
            
            <div className="mt-6 text-center text-white/70">
              <p>Don't have an account? Google sign-in will create one for you.</p>
            </div>
          </div>
          
          <div className="mt-8">
            <Link to="/" className="text-gold hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1601758123927-195e4b9f6e0e')] bg-cover bg-center opacity-20 z-0" />
      </section>
      
      {/* Features Preview */}
      <section className="py-16 px-4 max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-gold">Join TailMate Today</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Connect Pets', desc: 'Find perfect matches for your furry friends', icon: '🐾' },
            { title: 'Expert Care', desc: 'Access AI-powered pet care recommendations', icon: '🏥' },
            { title: 'Community', desc: 'Join a thriving community of pet lovers', icon: '❤️' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-navy/50 p-6 rounded-xl border border-gold/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:border-gold/60">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gold">{feature.title}</h3>
              <p className="text-white/70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Login;
