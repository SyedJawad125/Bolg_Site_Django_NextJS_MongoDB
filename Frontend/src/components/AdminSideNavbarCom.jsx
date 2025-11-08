'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Users, FileText, Settings, LogOut, Lock, Eye, Menu, X, ChevronRight, User, Shield } from 'lucide-react';

const AdminSideNavbarCom = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState('admin');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/admindashboard');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    const userInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
    
    setIsAuthenticated(!!token);
    setUserRole(role);

    // Parse user info if available
    if (userInfo) {
      try {
        setUserData(JSON.parse(userInfo));
      } catch (error) {
        console.error('Error parsing user info:', error);
        // Set default user data
        setUserData({
          Id: 2,
          Name: "Super",
          Code_name: "Su"
        });
      }
    }

    // Set active route based on current path
    if (typeof window !== 'undefined') {
      setActiveRoute(window.location.pathname);
    }
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
      path: '/blogpostpage',
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
    router.push(path);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userInfo');
    }
    setIsAuthenticated(false);
    router.push('/Login');
  };

  const handleChangePassword = () => {
    router.push('/changepassword');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userData?.Name) {
      return userData.Name.substring(0, 2).toUpperCase();
    }
    return 'AH';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (userData?.Name) {
      return userData.Name;
    }
    return 'Admin User';
  };

  // Get user role display
  const getUserRoleDisplay = () => {
    if (userData?.Code_name) {
      return userData.Code_name;
    }
    return userRole || 'Admin';
  };

  return (
    <div className="relative h-screen">
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } shadow-2xl border-r border-slate-700/50 z-50`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
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
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center shadow-lg transition-colors border border-slate-600"
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 shadow-lg shadow-blue-500/20'
                    : 'hover:bg-slate-700/30'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full shadow-lg" />
                )}
                
                {/* Background glow effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
                )}
                
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 relative z-10 ${
                    isHovered ? 'scale-110' : ''
                  } ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                />
                
                {!isCollapsed && (
                  <span className={`flex-1 text-left font-medium relative z-10 ${
                    isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                )}
                
                {!isCollapsed && isHovered && !isActive && (
                  <ChevronRight className="w-4 h-4 text-slate-400 relative z-10" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          {/* User Info - Enhanced Design */}
          {!isCollapsed && (
            <div className="mb-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {getUserInitials()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-slate-300 capitalize mt-1">
                    {getUserRoleDisplay()}
                  </p>
                  {userData?.Id && (
                    <p className="text-xs text-slate-400 mt-1">
                      ID: {userData.Id}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Collapsed User Info */}
          {isCollapsed && (
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                  {getUserInitials()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <Shield className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Change Password */}
          <button
            onClick={handleChangePassword}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-800/30 hover:bg-slate-700/40 border border-slate-700/50 hover:border-slate-600/60 transition-all duration-200 group ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <Lock className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600/90 to-red-700/90 hover:from-red-500/90 hover:to-red-600/90 shadow-lg shadow-red-500/20 transition-all duration-200 group ${
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
              onClick={() => router.push('/Login')}
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

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </div>
  );
};

export default AdminSideNavbarCom;