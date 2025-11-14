'use client';
import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';

// Temporary blog data - will be replaced with backend data
const blogData = [
  {
    id: 1,
    title: 'The Evolution of E-Commerce',
    excerpt: 'E-commerce represents the modern transformation of retail — where technology meets convenience. Discover how businesses are reaching global audiences 24/7.',
    description: 'From secure digital payments to data-driven marketing, online commerce has redefined how consumers shop and how brands build trust.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    category: 'E-Commerce',
    author: 'Sarah Johnson',
    date: '2024-11-10',
    readTime: '5 min read',
    featured: true
  },
  {
    id: 2,
    title: 'Future of Digital Marketing',
    excerpt: 'Explore the latest trends shaping digital marketing in 2024. AI-powered personalization and automation are transforming how brands connect with audiences.',
    description: 'Learn about emerging technologies and strategies that are revolutionizing customer engagement and driving business growth.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    category: 'Marketing',
    author: 'Michael Chen',
    date: '2024-11-08',
    readTime: '7 min read',
    featured: false
  },
  {
    id: 3,
    title: 'Building Modern Web Applications',
    excerpt: 'A comprehensive guide to creating scalable, performant web applications using the latest frameworks and best practices in modern development.',
    description: 'Dive deep into React, Next.js, and cutting-edge tools that are shaping the future of web development.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    category: 'Technology',
    author: 'Emily Rodriguez',
    date: '2024-11-05',
    readTime: '10 min read',
    featured: false
  },
  {
    id: 4,
    title: 'The Art of Brand Storytelling',
    excerpt: 'Master the craft of compelling brand narratives that resonate with your audience. Learn how authentic storytelling drives loyalty and engagement.',
    description: 'Discover techniques used by top brands to create emotional connections and build lasting relationships with customers.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    category: 'Branding',
    author: 'David Thompson',
    date: '2024-11-03',
    readTime: '6 min read',
    featured: false
  }
];

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);

  const categories = ['All', 'E-Commerce', 'Marketing', 'Technology', 'Branding'];
  
  const filteredBlogs = selectedCategory === 'All' 
    ? blogData 
    : blogData.filter(blog => blog.category === selectedCategory);

  const handleBlogClick = (blogId) => {
    // Later will navigate to: router.push(`/blog/${blogId}`);
    console.log('Navigate to blog:', blogId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfaf6] via-[#f9f6f1] to-[#f7f3ec]">
      {/* Decorative background elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#e8c547]/5 rounded-full blur-3xl"></div>

      {/* Header Section */}
      <div className="relative pt-20 pb-12 px-6 md:px-20">
        <div className="max-w-7xl mx-auto text-center">
          {/* Top decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6 animate-fadeIn">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
            <span className="text-[#d4af37] text-xs font-semibold tracking-[0.3em] uppercase">
              Our Stories
            </span>
            <div className="w-12 h-px bg-gradient-to-r from-[#d4af37] via-transparent to-transparent"></div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#2a1f0f] mb-6 animate-slideUp">
            Insights & Inspiration
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light animate-fadeInDelay">
            Explore articles crafted with passion, covering trends, strategies, and stories that matter.
          </p>
        </div>

        {/* Category Filter */}
        <div className="max-w-4xl mx-auto mt-12 animate-fadeInDelay2">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#e8c547] to-[#d4af37] text-black shadow-[0_5px_20px_rgba(212,175,55,0.4)] scale-105'
                    : 'bg-white/80 text-gray-700 border border-[#e6d5b8]/50 hover:border-[#d4af37]/50 hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Blog (First Blog) */}
      {filteredBlogs.length > 0 && filteredBlogs[0].featured && (
        <div className="relative px-6 md:px-20 mb-20">
          <div className="max-w-7xl mx-auto">
            <div 
              className="relative flex flex-col md:flex-row items-center md:items-stretch rounded-2xl border border-[#e6d5b8]/50 bg-white/90 backdrop-blur-xl shadow-[0_10px_60px_rgba(212,175,55,0.12)] overflow-hidden group hover:shadow-[0_15px_80px_rgba(212,175,55,0.25)] transition-all duration-700 ease-in-out cursor-pointer"
              onClick={() => handleBlogClick(filteredBlogs[0].id)}
            >
              {/* Image Section */}
              <div className="relative w-full md:w-1/2 overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#d4af37]/40 z-10"></div>
                
                <img
                  src={filteredBlogs[0].image}
                  alt={filteredBlogs[0].title}
                  className="w-full h-full min-h-[400px] md:min-h-[600px] object-cover transform group-hover:scale-110 transition-transform duration-[3000ms] ease-out brightness-[0.95] group-hover:brightness-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-[#d4af37]/10"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#d4af37]/40"></div>

                {/* Featured Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#e8c547] text-black text-xs font-bold tracking-wider rounded-full shadow-lg">
                  FEATURED
                </div>
              </div>

              {/* Text Section */}
              <div className="relative w-full md:w-1/2 p-10 md:p-14 lg:p-16 text-gray-800 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-gradient-to-r from-[#d4af37] to-transparent"></div>
                  <span className="text-[#d4af37] text-xs font-semibold tracking-[0.3em] uppercase">
                    {filteredBlogs[0].category}
                  </span>
                </div>

                <div className="relative mb-8">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#d4af37] via-[#e8c547] to-[#d4af37] rounded-full"></div>
                  <h2 className="pl-6 text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#2a1f0f] leading-tight">
                    {filteredBlogs[0].title}
                  </h2>
                </div>

                <div className="space-y-5 mb-8">
                  <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-light">
                    {filteredBlogs[0].excerpt}
                  </p>
                  <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-light">
                    {filteredBlogs[0].description}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#d4af37]" />
                    <span>{filteredBlogs[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#d4af37]" />
                    <span>{new Date(filteredBlogs[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#d4af37]" />
                    <span>{filteredBlogs[0].readTime}</span>
                  </div>
                </div>

                <button className="group/btn relative w-fit px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e8c547] to-[#d4af37] text-black font-semibold rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    Read Full Story
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-500"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="relative px-6 md:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.slice(1).map((blog, index) => (
              <div
                key={blog.id}
                className="group relative bg-white/90 backdrop-blur-xl rounded-2xl border border-[#e6d5b8]/50 overflow-hidden hover:shadow-[0_15px_60px_rgba(212,175,55,0.2)] transition-all duration-500 cursor-pointer hover:-translate-y-2"
                onClick={() => handleBlogClick(blog.id)}
                onMouseEnter={() => setHoveredCard(blog.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#d4af37]/90 backdrop-blur-sm text-white text-xs font-bold tracking-wider rounded-full flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />
                    {blog.category}
                  </div>

                  {/* Hover Arrow */}
                  <div className={`absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-[#d4af37] to-[#e8c547] rounded-full flex items-center justify-center transition-all duration-300 ${
                    hoveredCard === blog.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}>
                    <ArrowRight className="w-5 h-5 text-black" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-bold text-[#2a1f0f] mb-3 line-clamp-2 group-hover:text-[#d4af37] transition-colors duration-300">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-4 border-t border-[#e6d5b8]/50">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{blog.readTime}</span>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4 flex items-center gap-2 text-[#d4af37] font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]/30 rounded-br-lg"></div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag className="w-10 h-10 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#2a1f0f] mb-3">
                No blogs found
              </h3>
              <p className="text-gray-600">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Elegant Footer Glow */}
      <div className="relative pb-20">
        <div className="flex justify-center">
          <div className="w-96 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-[#d4af37] to-[#e8c547] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]"></div>
        </div>
      </div>

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
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 1s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease-in forwards;
        }
        .animate-fadeInDelay {
          animation: fadeIn 1.5s ease-in 0.3s forwards;
          opacity: 0;
        }
        .animate-fadeInDelay2 {
          animation: fadeIn 1.5s ease-in 0.6s forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}