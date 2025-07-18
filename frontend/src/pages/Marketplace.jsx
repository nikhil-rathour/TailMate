import { useState } from 'react';
import { FiSearch, FiShoppingCart, FiFilter } from 'react-icons/fi';

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

  return (
    <section className="p-4 max-w-7xl mx-auto">
      <div className="rounded-xl overflow-hidden mb-6">
        <img src="/marketplace-hero.jpg" alt="Marketplace Banner" className="w-full h-64 object-cover" />
        <div className="-mt-24 p-6 bg-black bg-opacity-40 text-white">
          <h1 className="text-4xl font-bold">Discover Amazing Pet Essentials & Support Great Causes!</h1>
          <p className="text-lg mt-2">Explore our curated selection of high-quality products for your beloved companions.</p>
          <button className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full font-semibold">Shop All Products</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full font-medium ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg flex-grow">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg">
          <FiFilter /> Sort
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="border rounded-xl p-4 relative bg-white">
            {product.label && (
              <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                {product.label}
              </span>
            )}
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
            <h3 className="font-semibold text-lg mt-2">{product.name}</h3>
            <div className="text-gray-700">
              ${product.price}
              {product.originalPrice && <span className="text-sm line-through ml-2 text-gray-400">${product.originalPrice}</span>}
            </div>
            <button className="mt-2 flex items-center justify-center gap-2 text-sm px-4 py-2 border rounded-md font-medium w-full hover:bg-gray-100">
              <FiShoppingCart /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
