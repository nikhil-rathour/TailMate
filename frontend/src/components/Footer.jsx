export default function Footer() {
  return (

     <footer className="bg-gray-900 text-white py-10 px-4 text-center">
        <h3 className="text-xl font-bold mb-4">TailMate</h3>
        <div className="mb-6">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l-full text-black"
          />
          <button className="bg-orange-500 px-4 py-2 rounded-r-full hover:bg-orange-600">Subscribe</button>
        </div>
        <p className="text-sm">&copy; 2023 TailMate. All rights reserved.</p>
      </footer>
  )
}
