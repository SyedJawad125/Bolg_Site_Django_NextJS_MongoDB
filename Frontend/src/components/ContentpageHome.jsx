'use client';
import Image from 'next/image';
import img1 from '../../public/images/1.jpg';

export default function DesignPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#fdfaf6] to-[#f7f3ec] py-16 px-6 md:px-20">
      <div className="flex flex-col md:flex-row items-center md:items-start max-w-6xl mx-auto rounded-3xl border border-[#e6d5b8] bg-white/80 backdrop-blur-xl shadow-[0_8px_40px_rgba(212,175,55,0.15)] overflow-hidden hover:shadow-[0_10px_50px_rgba(212,175,55,0.3)] transition-all duration-500 ease-in-out">

        {/* Image Section */}
        <div className="w-full md:w-1/2 overflow-hidden">
          <Image
            src={img1}
            alt="E-commerce blog illustration"
            width={600}
            height={600}
            className="rounded-none md:rounded-l-3xl object-cover w-full h-full transform hover:scale-105 transition-transform duration-[2500ms] ease-out"
          />
        </div>

        {/* Text Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 text-gray-800">
          <div className="border-l-4 border-[#d4af37] pl-4 mb-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3a2c1a]">
              The Evolution of E-Commerce
            </h2>
          </div>

          <p className="text-lg leading-relaxed text-gray-700 font-light">
            E-commerce represents the modern transformation of retail — where technology meets convenience. 
            Businesses can now reach a global audience 24/7, offering diverse products and personalized experiences 
            beyond the limits of traditional storefronts.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-gray-700 font-light">
            From secure digital payments to data-driven marketing, online commerce has redefined how consumers shop 
            and how brands build trust. It’s not just about transactions — it’s about creating meaningful digital journeys.
          </p>

          <div className="mt-8">
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e8c547] text-black font-medium rounded-full shadow-md hover:shadow-[0_0_20px_rgba(232,197,71,0.6)] transition-all duration-500">
              Read More →
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Footer Glow */}
      <div className="mt-12 w-2/3 h-[2px] bg-gradient-to-r from-[#d4af37] via-[#e8c547] to-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)] rounded-full"></div>
    </div>
  );
}
