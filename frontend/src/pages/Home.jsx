import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  
  return (
    <div className="bg-navy min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative bg-navy h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Connecting Hearts, One Paw at a Time.</h1>
          <p className="text-xl md:text-2xl mb-8 text-gold font-medium drop-shadow">Your ultimate pet companion ecosystem for dating, adoption, marketplace, and AI care.</p>
          <div className="space-x-4">
            <Link to="/dating">
              <button className="bg-gold hover:bg-accent-orange text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition">Find Your Fur-ever Friend</button>
            </Link>
            <Link to="/aipetcare">
              <button className="bg-white hover:bg-beige text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition">Ai Pet Care</button>
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1601758123927-195e4b9f6e0e')] bg-cover bg-center opacity-20 z-0" />
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-gold tracking-tight">Discover TailMate's Core Features</h2>
        <p className="text-lg text-softgray mb-10">A comprehensive ecosystem designed to enhance every aspect of pet ownership.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[
            { title: 'Pet Dating', desc: 'Discover compatible furry friends.', color: 'bg-beige', btn: 'Start Matching' },
            { title: 'Pet Adoption', desc: 'Give a loving home to pets in need.', color: 'bg-lightgray', btn: 'Adopt Now' },
            { title: 'Marketplace', desc: 'Buy & sell pet essentials.', color: 'bg-white', btn: 'Shop Now' },
            { title: 'Emergency Help', desc: 'Access nearby vets & services.', color: 'bg-beige', btn: 'Get Help' },
            { title: 'AI PetCare', desc: 'Personalized care plans.', color: 'bg-lightgray', btn: 'Optimize Care' },
          ].map((feature, idx) => (
            <div key={idx} className={`p-8 rounded-3xl shadow-xl ${feature.color} flex flex-col items-center border-2 border-navy/10`}> 
              <h3 className="text-2xl font-bold mb-2 text-navy">{feature.title}</h3>
              <p className="text-base text-softgray mb-6">{feature.desc}</p>
              <button className="bg-gold hover:bg-accent-orange text-navy px-6 py-2 rounded-full font-semibold shadow transition">{feature.btn}</button>
            </div>
          ))}
        </div>
      </section>



      {/* Partners */}
      <section className=" py-16 px-4 text-center">
        <h2 className="text-3xl font-extrabold mb-8 text-white">Our Trusted Partners</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {[...Array(9)].map((_, idx) => (
            <div key={idx} className="w-20 h-20 bg-lightgray rounded-full border-2 border-navy/10"></div>
          ))}
        </div>
      </section>

      {/* Footer */}
      {/* You can add a styled footer here if needed */}
    </div>
  );
}
