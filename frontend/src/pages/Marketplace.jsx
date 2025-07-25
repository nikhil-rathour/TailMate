import React, { useState } from 'react';
import { FiSearch, FiShoppingCart, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import MarketPlaceVideo from '../videos/MarketPlaceVideo';


const categories = ['All Products', 'Food & Treats', 'Toys & Games', 'Accessories', 'Health & Wellness', 'Grooming'];

const products = [
  {
    id: 1,
    name: 'Premium Adult Dog Food',
    price: 49.99,
    originalPrice: 55,
    image: '/dogfood.jpg',
    label: 'Best Seller',
    category: 'Food & Treats'
  },
  {
    id: 2,
    name: 'Interactive Feather Wand Cat Toy',
    price: 12.5,
    image: '/catwand.jpg',
    label: 'New',
    category: 'Toys & Games'
  },
  // Add more product objects here with category...
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(product =>
    (selectedCategory === 'All Products' || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-navy min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative bg-navy h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg"
          >
            Pet Essentials Marketplace
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 text-gold font-medium drop-shadow max-w-3xl"
          >
            Discover premium products for your beloved companions. Every purchase supports animal welfare initiatives.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transform hover:scale-105">
              Shop All Products
            </button>
          </motion.div>
        </div>
        <MarketPlaceVideo/>
        {/* <div className="absolute right-0 bottom-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1583337130417-3346a1be7dee')] bg-cover bg-center opacity-20 z-0" /> */}
      </section>

      {/* Categories and Search Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-gold text-navy shadow-md' 
                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </motion.button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg flex-grow">
              <FiSearch className="text-gold mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none w-full text-white placeholder-white/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <FiFilter className="text-gold" /> 
              <span>Sort</span>
            </motion.button>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <motion.div 
                key={product.id} 
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 relative border border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500 group"
              >
                {product.label && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-gold to-accent-orange text-navy text-xs font-bold px-3 py-1 rounded-full z-10">
                    {product.label}
                  </span>
                )}
                <div className="h-48 w-full rounded-xl overflow-hidden mb-4">
                  <img 
                    src={product.image || '/default-product.jpg'} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-bold text-xl mb-2 text-gold">{product.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xl font-bold">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm line-through ml-2 text-white/60">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-sm bg-white/10 px-2 py-1 rounded-full">{product.category}</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy py-3 px-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <FiShoppingCart /> Add to Cart
                </motion.button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-white/70">No products found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('All Products');
                  setSearch('');
                }}
                className="mt-4 bg-gold text-navy px-6 py-2 rounded-full font-medium"
              >
                Reset Filters
              </button>
            </div>
          )}
        </motion.div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gold text-center">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Summer Essentials', image: '/summer-pets.jpg', desc: 'Keep your pets cool and comfortable' },
            { title: 'Training Supplies', image: '/training-pets.jpg', desc: 'Everything you need for effective training' },
            { title: 'Cozy Beds & Furniture', image: '/beds-pets.jpg', desc: 'Give your pet the comfort they deserve' },
          ].map((collection, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-500 group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={collection.image || '/default-collection.jpg'} 
                  alt={collection.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gold">{collection.title}</h3>
                <p className="text-white/80 mb-4">{collection.desc}</p>
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-all duration-300">
                  Explore Collection
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gold">Join Our Pet Lovers Community</h2>
          <p className="text-lg mb-6 text-white/80">Subscribe to our newsletter for exclusive deals, pet care tips, and new product alerts.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-full bg-white/10 border border-gold/30 text-white focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button className="bg-gradient-to-r from-gold to-accent-orange hover:from-accent-orange hover:to-gold text-navy px-6 py-3 rounded-full font-bold transition-all duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}