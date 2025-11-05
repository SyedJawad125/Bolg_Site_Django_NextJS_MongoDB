'use client';
import React from 'react';
import Image from 'next/image';
import logo from '../../public/images/logo5.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200 pt-12 pb-6 border-t-4 border-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-[0_0_25px_rgba(255,200,0,0.3)]">
      {/* Top section */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 px-6 md:px-16">
        
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <a href="/">
            <Image
              src={logo}
              alt="Logo"
              width={160}
              height={90}
              className="rounded-lg shadow-lg border border-amber-500/30 hover:shadow-[0_0_20px_rgba(255,200,0,0.4)] transition-all duration-500"
            />
          </a>
          <p className="text-gray-400 text-sm mt-4 text-center md:text-left leading-relaxed">
            Empowering businesses and individuals with elegant digital solutions that inspire innovation and success.
          </p>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-amber-400">Support</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="/faq" className="hover:text-amber-300 transition-colors duration-300">FAQ</a></li>
            <li><a href="/contact" className="hover:text-amber-300 transition-colors duration-300">Contact Us</a></li>
            <li><a href="/returns" className="hover:text-amber-300 transition-colors duration-300">Returns</a></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-amber-400">Useful Links</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-amber-300 transition-colors duration-300">Home</a></li>
            <li><a href="/about" className="hover:text-amber-300 transition-colors duration-300">About Us</a></li>
            <li><a href="/contact" className="hover:text-amber-300 transition-colors duration-300">Contact</a></li>
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-amber-400">Our Services</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="/publicproduct" className="hover:text-amber-300 transition-colors duration-300">Products</a></li>
            <li><a href="/publiccategory" className="hover:text-amber-300 transition-colors duration-300">Categories</a></li>
            <li><a href="/blog" className="hover:text-amber-300 transition-colors duration-300">Blog</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-amber-400">Contact Us</h2>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-amber-400" />
              DHA Phase 2, Islamabad, Pakistan
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faPhone} className="mr-3 text-amber-400" /> (+92) 333 1906382
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-amber-400" /> nicenick1992@gmail.com
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-5">
            {[
              { icon: <FaFacebookF />, href: 'https://www.facebook.com' },
              { icon: <FaTwitter />, href: 'https://www.twitter.com' },
              { icon: <FaInstagram />, href: 'https://www.instagram.com' },
              { icon: <FaWhatsapp />, href: 'https://wa.me/923331906382' },
              { icon: <FaLinkedinIn />, href: 'https://www.linkedin.com/in/syed-jawad-ali-080286b9/' },
              { icon: <FaYoutube />, href: 'https://www.youtube.com' },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 text-xl p-2 rounded-full border border-amber-500/40 hover:bg-amber-400 hover:text-black transition-all duration-500 hover:shadow-[0_0_15px_rgba(255,200,0,0.8)]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="mt-10 border-t border-gray-700/60 w-11/12 mx-auto"></div>

      {/* Bottom Text */}
      <div className="text-center mt-6 text-gray-400 text-sm">
        <p>
          © {new Date().getFullYear()} <span className="text-amber-400 font-semibold">Your Company</span>. All rights reserved.
        </p>
        <p className="mt-1 text-xs italic text-gray-500">
          Designed with passion by <span className="text-amber-400">Syed Jawad Ali</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
