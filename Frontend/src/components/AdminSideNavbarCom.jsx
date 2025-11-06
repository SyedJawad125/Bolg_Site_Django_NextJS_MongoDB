// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';

// const Sidebar = () => {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState(null); // State to store the user role

//   // Function to determine if a link is active
//   const isActive = (pathname) => router.pathname === pathname;

//   useEffect(() => {
//     // Check authentication status and user role only on the client side
//     const token = localStorage.getItem('token');
//     const role = localStorage.getItem('role'); // Assume role is stored in localStorage
//     setIsAuthenticated(!!token);
//     setUserRole(role); // Store the role in the state
//   }, []);

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role'); // Remove role on logout
//     setIsAuthenticated(false);
//     router.push('/Login');
//   };

//   const handleChangepassword = () => {
//     router.push("/changepassword");
//   };

//   return (
//     <div className="flex">
//       <div className="w-55 h-screen bg-gray-800 text-white p-4 flex flex-col justify-between fixed top-0 left-0">
//         <div>
//           <h2 className="text-2xl mb-6">Admin Panel</h2>
//           <nav>
//             {/* Conditionally render links based on the user's role */}
//             {/* {userRole !== '10' && ( */}
              
//                 <Link href="/admindashboard">
//                   <div className={`block py-2.5 px-4 rounded ${isActive('/admindashboard') ? 'bg-gray-700' : 'hover:text-red-500 px-3 py-2'}`}>
//                     Adminpage
//                   </div>
//                 </Link>
//                 <Link href="/employeepage">
//                   <div className={`block py-2.5 px-4 rounded ${isActive('/employeepage') ? 'bg-gray-700' : 'hover:text-red-500 px-3 py-2'}`}>
//                     Employee Record
//                   </div>
//                 </Link>
          
//             {/* )} */}
//             <Link href="/clientselfpage">
//               <div className={`block py-2.5 px-4 rounded ${isActive('/clientselfpage') ? 'bg-gray-700' : 'hover:text-red-500 px-3 py-2'}`}>
//                 Client Self Detail
//               </div>
//             </Link>
//             <Link href="/">
//               <div className={`block py-2.5 px-4 rounded ${isActive('/') ? 'bg-gray-700' : 'hover:text-red-500 px-3 py-2'}`}>
//                 Public Site
//               </div>
//             </Link>
//           </nav>
//         </div>
//         <div className="space-y-2"> {/* Added space-y-2 to control the gap between elements */}
//           {isAuthenticated ? (
//             <button onClick={logout} className="w-full py-2 px-4 bg-red-600 rounded hover:bg-red-500">
//               Logout
//             </button>
//           ) : (
//             <Link href="/Login">
//               <div className="block py-2 px-4 bg-green-600 rounded hover:bg-green-500 text-center cursor-pointer">
//                 Login
//               </div>
//             </Link>
//           )}
//           <div className="flex justify-end">
//             <button 
//               onClick={handleChangepassword} 
//               className="block py-2 px-4 bg-green-700 rounded hover:bg-green-500 text-center cursor-pointer">
//               Change Password
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;




import { useState, useEffect } from 'react';
import { Home, Users, FileText, Settings, LogOut, Lock, Eye, Menu, X, ChevronRight } from 'lucide-react';

const AdminSideNavbarCom = ({ onNavigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState('admin');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/admindashboard');
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    // Simulated auth check - replace with actual logic
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/admindashboard',
      roles: ['admin', 'editor']
    },
    {
      id: 'posts',
      label: 'Blog Posts',
      icon: FileText,
      path: '/posts',
      roles: ['admin', 'editor']
    },
    {
      id: 'employees',
      label: 'Employee Records',
      icon: Users,
      path: '/employeepage',
      roles: ['admin']
    },
    {
      id: 'profile',
      label: 'Client Profile',
      icon: Eye,
      path: '/clientselfpage',
      roles: ['admin', 'editor', 'client']
    },
    {
      id: 'public',
      label: 'Public Site',
      icon: Home,
      path: '/',
      roles: ['admin', 'editor', 'client']
    }
  ];

  const handleNavigation = (path) => {
    setActiveRoute(path);
    // In real Next.js: router.push(path)
    console.log('Navigate to:', path);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    setIsAuthenticated(false);
    // In real Next.js: router.push('/Login')
    console.log('Logged out');
  };

  const handleChangePassword = () => {
    // In real Next.js: router.push('/changepassword')
    console.log('Navigate to change password');
  };

  return (
    <div className="relative h-screen">
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } shadow-2xl border-r border-slate-700/50`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    BlogCMS
                  </h2>
                  <p className="text-xs text-slate-400">Admin Panel</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.path;
            const isHovered = hoveredItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20'
                    : 'hover:bg-slate-700/50'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                )}
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isHovered ? 'scale-110' : ''
                  } ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                />
                {!isCollapsed && (
                  <span className={`flex-1 text-left font-medium ${
                    isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                )}
                {!isCollapsed && isHovered && !isActive && (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          {/* User Info */}
          {!isCollapsed && (
            <div className="mb-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
                  AH
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Admin User</p>
                  <p className="text-xs text-slate-400 capitalize">{userRole || 'Admin'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Change Password */}
          <button
            onClick={handleChangePassword}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 group ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <Lock className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            {!isCollapsed && (
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                Change Password
              </span>
            )}
          </button>

          {/* Logout */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/20 transition-all duration-200 group ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-5 h-5 text-white" />
              {!isCollapsed && (
                <span className="text-sm font-medium text-white">
                  Logout
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => console.log('Navigate to login')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/20 transition-all duration-200 group ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <Lock className="w-5 h-5 text-white" />
              {!isCollapsed && (
                <span className="text-sm font-medium text-white">
                  Login
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default AdminSideNavbarCom;