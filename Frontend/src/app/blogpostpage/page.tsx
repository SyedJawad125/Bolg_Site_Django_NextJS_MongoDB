// 'use client'
// import React from 'react'
// import AdminSideNavbarCom from "@/components/AdminSideNavbarCom";
// import BlogPostCom from "@/components/BlogPostCom";


// const AdminDashborad = () => {
//   return (
//     <div className="flex h-screen">
      
//       <div className="w-[15%] bg-gray-800 text-white">
//         <AdminSideNavbarCom />
//       </div>
//       <div className="w-[85%] p-6 bg-black">
//         <BlogPostCom />
//       </div>
//     </div> 
//   )
// }

// export default AdminDashborad




'use client'
import React from 'react'
import AdminSideNavbarCom from "@/components/AdminSideNavbarCom";
import BlogPostCom from "@/components/BlogPostCom";

const AdminDashborad = () => {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar - 15% width */}
      <div className="w-[16.5%] min-w-[200px] max-w-[300px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <AdminSideNavbarCom />
      </div>
      
      {/* Main Content - 85% width */}
      <div className="w-[85%] bg-black-900 overflow-auto ml-2">
        <div className="p-5 h-full">
          <BlogPostCom />
        </div>
      </div>
    </div> 
  )
}

export default AdminDashborad;