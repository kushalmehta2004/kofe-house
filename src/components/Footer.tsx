import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-1">
          <img src="/logo.jpg" alt="KOFE House" className="h-16 w-auto object-contain rounded-md mb-4 grayscale opacity-80" />
          <p className="text-sm">
            Apna Adda, Apni Coffee. Premium scrollytelling experiences mixed with the purest local brew from Mumbai.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#C52A2E] transition-colors">Iced Classic Coffee</a></li>
            <li><a href="#" className="hover:text-[#C52A2E] transition-colors">Specialty Menu</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Mumbai Locations</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#C52A2E] transition-colors">Juhu</a></li>
            <li><a href="#" className="hover:text-[#C52A2E] transition-colors">Vile Parle (W)</a></li>
            <li><a href="#" className="hover:text-[#C52A2E] transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Stay Fresh</h4>
          <p className="text-sm mb-4">Join our newsletter for early access to new batches.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email address"
              className="bg-gray-900 border border-gray-800 rounded-l-md px-4 py-2 w-full focus:outline-none focus:border-[#C52A2E] text-white"
            />
            <button className="bg-[#C52A2E] hover:bg-[#A02225] text-white px-4 py-2 rounded-r-md transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs">
        <p>© {new Date().getFullYear()} KOFE House Mumbai. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
