'use client';
import React, { useState } from 'react';

const Contact = () => {
  const [name, setname] = useState('');
  const [phone_number, setphone_number] = useState('');
  const [email, setemail] = useState('');
  const [message, setmessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        "name": name,
        "phone_number": phone_number,
        "email": email,
        "message": message
      };
      
      // Replace this with your actual AxiosInstance call:
      // const response = await AxiosInstance.post('/ecommerce/contact', payload, {
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Simulated API call for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Response:', payload);
      setname('');
      setphone_number('');
      setemail('');
      setmessage('');
      
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fdfaf6] via-[#f9f6f1] to-[#f7f3ec] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-[#d4af37]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#e8c547]/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-[#d4af37]/3 rounded-full blur-2xl"></div>

      <div className="relative max-w-2xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
            <span className="text-[#d4af37] text-xs font-semibold tracking-[0.3em] uppercase">
              Get In Touch
            </span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#2a1f0f] mb-4 animate-slideUp">
            Contact Us
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 font-light max-w-xl mx-auto animate-fadeInDelay">
            We&apos;d love to hear from you! Share your thoughts and we&apos;ll get back to you soon.
          </p>
        </div>

        {/* Form Card */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-[#e6d5b8]/50 shadow-[0_10px_60px_rgba(212,175,55,0.12)] p-8 md:p-12 animate-fadeInDelay2">
          {/* Top corner accents */}
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#d4af37]/30 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#d4af37]/30 rounded-bl-2xl"></div>

          <div className="space-y-6 relative z-10">
            {/* Name Field */}
            <div className="group">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={e => setname(e.target.value)}
                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300 bg-white/50"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div className="group">
              <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setemail(e.target.value)}
                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300 bg-white/50"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone Field */}
            <div className="group">
              <label htmlFor="phone-number" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Phone Number
              </label>
              <input
                id="phone-number"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone_number}
                onChange={e => setphone_number(e.target.value)}
                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300 bg-white/50"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Message Field */}
            <div className="group">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                value={message}
                onChange={e => setmessage(e.target.value)}
                className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all duration-300 resize-none bg-white/50"
                placeholder="Tell us what's on your mind..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group/btn relative w-full px-8 py-4 bg-gradient-to-r from-[#d4af37] via-[#e8c547] to-[#d4af37] text-black font-semibold text-lg rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>

          {/* Bottom decorative element */}
          <div className="absolute bottom-8 right-8 flex items-center gap-2 opacity-20">
            <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
            <div className="w-2 h-2 rounded-full bg-[#e8c547]"></div>
            <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="mt-12 relative flex justify-center">
          <div className="w-64 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-pulse-slow"></div>
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
          animation: fadeIn 1.5s ease-in 0.5s forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Contact;