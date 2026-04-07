"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Droplets, Leaf } from "lucide-react";
import { singleProduct as product } from "../data/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductBottleScroll from "../components/ProductBottleScroll";

export default function Home() {
  // Set CSS variable for background gradient
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--product-gradient",
      product.gradient
    );
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen flex flex-col w-full relative">
      <Navbar />

      <div className="flex-grow w-full flex flex-col">
        {/* Scroll Canvas Experience */}
        <ProductBottleScroll product={product} />

        {/* Marketing Content */}
        <div className="bg-black/50 backdrop-blur-sm border-t border-white/5 py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl font-bold mb-6" style={{ color: product.themeColor }}>
                {product.detailsSection.title}
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                {product.detailsSection.description}
              </p>
              
              <div className="mt-10 grid grid-cols-3 gap-6">
                {product.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-3xl font-bold text-amber-500">{stat.val}</span>
                    <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-white/10 to-white/5 p-1 rounded-3xl border border-white/10 overflow-hidden relative group"
            >
              <div className="w-full aspect-[4/5] bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                 <img 
                   src="/gallery/iced-caramel-latte.png" 
                   alt="Specialty Coffee" 
                   className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                 <p className="absolute bottom-6 left-6 font-medium text-lg tracking-wide text-white drop-shadow-lg">
                   {product.features.join(" • ")}
                 </p>
              </div>
            </motion.div>
          </div>
          
          {/* Freshness Section */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="max-w-4xl mx-auto px-6 mt-32 text-center"
          >
             <h3 className="text-3xl md:text-5xl font-bold mb-6">{product.freshnessSection.title}</h3>
             <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
               {product.freshnessSection.description}
             </p>
          </motion.div>
        </div>

        {/* Commerce Section / Buy Now */}
        <div className="py-32 relative z-10 bg-black">
          <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
             className="max-w-4xl mx-auto px-6 text-center"
          >
            <h2 className="text-5xl font-bold mb-4">{product.name}</h2>
            <p className="text-2xl text-amber-500 mb-10">{product.buyNowSection.price} <span className="text-sm text-gray-500 font-medium">/ {product.buyNowSection.unit}</span></p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {product.buyNowSection.processingParams.map((param, i) => (
                <span key={i} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium">
                  {param}
                </span>
              ))}
            </div>

            <button className="bg-[#C52A2E] hover:bg-[#A02225] text-white px-12 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(197,42,46,0.5)] flex items-center justify-center gap-3 mx-auto flex-col group">
              <span className="flex items-center gap-3"><ShoppingBag size={24} /> Add to Cart</span>
            </button>
            
            <div className="mt-16 grid md:grid-cols-2 gap-8 text-left border-t border-white/10 pt-10">
              <div className="flex gap-4">
                <Droplets className="text-[#C52A2E] shrink-0" size={28} />
                <div>
                  <h4 className="font-bold mb-2">Delivery Promise</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{product.buyNowSection.deliveryPromise}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Leaf className="text-[#C52A2E] shrink-0" size={28} />
                <div>
                  <h4 className="font-bold mb-2">Our Guarantee</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{product.buyNowSection.returnPolicy}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specialty Gallery Section */}
        <div className="py-32 bg-zinc-950 relative z-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Specialty Menu</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">Discover our crafted favorites, from seasonal specials to Mumbai's best-loved lattes.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { src: "/gallery/toffee-coffee.png", title: "Toffee Coffee", price: "₹119" },
                { src: "/gallery/special-menu.png", title: "Seasonal Specials", price: "Explore" },
                { src: "/gallery/macchiato.png", title: "Caramel Macchiato", price: "₹129" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl hover:border-white/20 transition-colors"
                >
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                    <h4 className="text-3xl font-bold text-white mb-2">{item.title}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-[#C52A2E] font-bold text-xl">{item.price}</p>
                      <span className="text-xs uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">See Details</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
