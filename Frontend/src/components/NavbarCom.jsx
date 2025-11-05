'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const NavbarCom = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-md shadow-[0_3px_10px_rgba(0,0,0,0.4)]"
    >
      <div className="container mx-auto flex justify-between items-center py-3 px-8">
        {/* Brand Name */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 font-bold text-xl tracking-widest"
        >
          <Link href="/">AI Blogs</Link>
        </motion.div>

        {/* Nav Links */}
        <ul className="flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path} className="relative group">
                <Link href={item.path}>
                  <span
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'text-amber-400 font-semibold'
                        : 'text-gray-200 hover:text-amber-300'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
                {/* Animated underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-full bg-amber-400'
                      : 'w-0 bg-amber-300 group-hover:w-full'
                  }`}
                ></span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Elegant Glow Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"></div>
    </motion.nav>
  );
};

export default NavbarCom;





// 'use client';
// import React, { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// // import HoverBox from './HoverBox'; // Adjust the import path based on your project structure
// import HoverBox from '@/components/HoverBox';


// const NavbarCom = () => {
//   const pathname = usePathname(); // Hook to get the current path
//   const [hovering, setHovering] = useState(false);

//   const sampleProducts = [
//     { id: 1, img1: 'images/1.jpg', name: 'Leather Bag' },
//     { id: 2, img2: 'images/2.jpg', name: 'Pent Coat' },
//   ];

//   return (
//     <nav className="bg-blue-700 w-full">
//     <div className="container mx-auto flex justify-between items-center p-0">
//       <div className="text-white text-xl font-bold ml-10"> <Link href="/">ONLINE SHOP</Link></div>
//       <ul className="flex space-x-10 ml-auto mr-20">
//         {[
//           { name: 'Home', path: '/' },
//           { name: 'About', path: '/about' },
//           { name: 'Services', path: '/services' },
//           { name: 'New In', path: '/newarrivalspage' }, // "New In" moved here
//           { name: 'Products', path: '/publicproducts' },
//           { name: 'Categories', path: '/publiccategories' },
//           { name: 'Contact', path: '/contact' },
//           { name: 'Admin', path: '/admindashboard' },
//         ].map((item) => (
//           <li
//             key={item.path}
//             className={`relative mt-2 ${
//               item.name === 'New In' ? 'hover-group' : ''
//             }`}
//             onMouseEnter={() => item.name === 'New In' && setHovering(true)}
//             onMouseLeave={() => item.name === 'New In' && setHovering(false)}
//           >
//             <Link href={item.path}>
//               <div
//                 className={`${
//                   pathname === item.path ? 'text-red-500' : 'text-white'
//                 } hover:text-black px-3 py-2`}
//               >
//                 {item.name}
//               </div>
//             </Link>
//             {item.name === 'New In' && hovering && (
//               <HoverBox products={sampleProducts} />
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   </nav>
  
//   );
// };




// 'use client'
// import React from 'react'
// import Link from 'next/link';
// import HoverBox from "@/components/HoverBox";


// const [hovering, setHovering] = useState(false);

// const NavbarCom = () => {

//   const sampleProducts = [
//     { id: 1, img1: '1.jpg', name: 'Leather Bag' },
//     { id: 2, img2: '2.jpg', name: 'Pent Coat' },
//   ];
  
//   return (
//     <>
//     <nav className="bg-blue-700 w-full">
//   <div className="container mx-auto flex justify-between items-center p-2">
//     <div className="text-white text-xl font-bold">
//       ONLINE SHOP
//     </div>
//     <ul className="flex space-x-10 ml-auto mr-20">
//       <li>
//         <Link href="/">
//           <div className="text-white hover:text-gray-300">Home</div>
//         </Link>
//       </li>
//       <li>
//         <Link href="/about">
//           <div className="text-white hover:text-gray-300">About</div>
//         </Link>
//       </li>
//       <li>
//         <Link href="/services">
//           <div className="text-white hover:text-gray-300">Services</div>
//         </Link>
//       </li>
//       <li>
//         <Link href="/publicproducts">
//           <div className="text-white hover:text-gray-300">Products</div>
//         </Link>
//       </li>
//       <li>
//         <Link href="/publiccategories">
//           <div className="text-white hover:text-gray-300">Categories</div>
//         </Link>
//       </li>
//       <li>
//         <Link href="/contact">
//           <div className="text-white hover:text-gray-300">Contact</div>
//         </Link>
//       </li>
//       <li>
//         <Link href="/admindashboard">
//           <div className="text-white hover:text-gray-300">Admin</div>
//         </Link>
//       </li>
//     </ul>
//   </div>
// </nav>

//     </>
//   )
// }

// export default NavbarCom