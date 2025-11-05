'use client';
import React from 'react';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import banner1 from '../../public/images/banner1.jpg';
import banner2 from '../../public/images/banner2.jpg';
import banner3 from '../../public/images/banner3.jpg';
import banner4 from '../../public/images/banner4.jpg';
import banner5 from '../../public/images/banner5.jpg';

const banners = [
  {
    src: banner1,
    title: 'The Art of Modern Leadership',
    subtitle: 'Explore insights, ideas, and innovations shaping the workplace of tomorrow.',
  },
  {
    src: banner2,
    title: 'Redefining Team Culture',
    subtitle: 'Inspiring stories of collaboration, growth, and purpose.',
  },
  {
    src: banner3,
    title: 'Behind Every Success Story',
    subtitle: 'Discover people, passion, and purpose driving progress.',
  },
  {
    src: banner4,
    title: 'Trends That Matter',
    subtitle: 'Uncover strategies that empower today’s creators and innovators.',
  },
  {
    src: banner5,
    title: 'Voices of Change',
    subtitle: 'Thoughts and reflections from industry leaders around the globe.',
  },
];

const BlogLuxuryBanner = () => {
  return (
    <div className="relative w-full overflow-hidden border-y-[3px] border-gradient-to-r from-[#d4af37] via-[#e8c547] to-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.3)]">
      <Carousel
        showThumbs={false}
        showStatus={false}
        autoPlay
        infiniteLoop
        interval={5500}
        transitionTime={1200}
        stopOnHover
        swipeable
        emulateTouch
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && (
            <button
              onClick={onClickHandler}
              className="absolute left-5 top-1/2 z-20 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
            >
              ‹
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <button
              onClick={onClickHandler}
              className="absolute right-5 top-1/2 z-20 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all duration-300"
            >
              ›
            </button>
          )
        }
      >
        {banners.map((banner, index) => (
          <div key={index} className="relative">
            {/* Image */}
            <div className="w-full h-[20vh] md:h-[25vh]">
              <Image
                src={banner.src}
                alt={banner.title}
                priority={index === 0}
                className="object-cover w-full h-full brightness-[0.85] hover:brightness-100 transition-all duration-[2500ms] ease-out"
              />
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Text content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-[8%]">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white/90 leading-tight drop-shadow-lg animate-slideUp">
                {banner.title}
              </h2>
              <p className="mt-4 text-lg md:text-xl text-gray-200/90 max-w-2xl animate-fadeIn delay-300">
                {banner.subtitle}
              </p>
              <div className="mt-6">
                <button className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#e8c547] text-black font-medium rounded-full shadow-md hover:shadow-[0_0_20px_rgba(232,197,71,0.6)] transition-all duration-500">
                  Read Articles →
                </button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Decorative border glow */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#d4af37] via-[#e8c547] to-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 1.2s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 2s ease-in forwards;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default BlogLuxuryBanner;
