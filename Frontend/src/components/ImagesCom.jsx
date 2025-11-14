'use client';
import React, { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthContext';
import Image from 'next/image';
import { Search, Plus, Filter, Edit2, Trash2, ImageIcon, Folder, Grid3x3, Eye } from 'lucide-react';

const ImagesCom = () => {
  const router = useRouter();
  const { permissions = {} } = useContext(AuthContext);
  const [data, setData] = useState({
    images: [],
    count: 0,
    total_pages: 1,
    current_page: 1,
    limit: 12,
    offset: 0,
    next: false,
    previous: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Check for permissions - try multiple possible permission names (same pattern as category)
  const hasReadPermission = permissions.read_image || permissions.READ_IMAGE;
  const hasCreatePermission = permissions.create_image || permissions.CREATE_IMAGE;
  const hasUpdatePermission = permissions.update_image || permissions.UPDATE_IMAGE;
  const hasDeletePermission = permissions.delete_image || permissions.DELETE_IMAGE;

  const fetchCategories = async () => {
    try {
      const res = await AxiosInstance.get('/api/images/v1/images/');
      if (res?.data?.data) {
        setCategories(res.data.data);
      } else if (res?.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    if (hasReadPermission) {
      fetchImages();
      fetchCategories();
    }
  }, [data.current_page, data.limit, data.offset, hasReadPermission]);

  const fetchImages = async () => {
    if (!hasReadPermission) {
      toast.error('You do not have permission to view images');
      return;
    }

    setIsLoading(true);
    try {
      const res = await AxiosInstance.get(
        `/api/images/v1/images/?page=${data.current_page}&limit=${data.limit}&offset=${data.offset}`
      );
      
      if (res?.data?.data) {
        const responseData = res.data.data;
        setData({
          images: responseData.images || [],
          count: responseData.count || 0,
          total_pages: responseData.total_pages || 1,
          current_page: responseData.current_page || 1,
          limit: responseData.limit || 12,
          offset: responseData.offset || 0,
          next: responseData.next || false,
          previous: responseData.previous || false
        });
      } else if (res?.data) {
        setData({
          images: res.data.images || [],
          count: res.data.count || 0,
          total_pages: res.data.total_pages || 1,
          current_page: res.data.current_page || 1,
          limit: res.data.limit || 12,
          offset: res.data.offset || 0,
          next: res.data.next || false,
          previous: res.data.previous || false
        });
      } else {
        console.error('Unexpected response structure:', res);
        toast.error('Received unexpected data format from server');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view images');
      } else {
        toast.error(error.response?.data?.message || 'Error fetching images');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!hasDeletePermission) {
      toast.error('You do not have permission to delete images');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const res = await AxiosInstance.delete(`/api/images/v1/images/?id=${id}`);
      if (res) {
        toast.success('Image deleted successfully!');
        fetchImages();
      }
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete images');
      } else {
        toast.error('Error deleting image!');
      }
    }
  };

  const updateRecord = async (imgid) => {
    if (!hasUpdatePermission) {
      toast.error('You do not have permission to update images');
      return;
    }
    router.push(`/updateimagespage?imgid=${imgid}`);
  };

  const handleSearch = async (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!hasReadPermission) {
      return;
    }

    try {
      const res = await AxiosInstance.get(`/api/images/v1/images/?search=${value}`);
      if (res && res.data && res.data.data) {
        setData(prev => ({
          ...prev,
          images: res.data.data.images || [],
          count: res.data.data.count || 0,
          current_page: 1
        }));
      }
    } catch (error) {
      console.error('Search error:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to search images');
      }
    }
  };

  const handlePageChange = (page) => {
    setData(prev => ({
      ...prev,
      current_page: page
    }));
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setData(prev => ({
      ...prev,
      limit: newLimit,
      current_page: 1
    }));
  };

  const handleAddImage = () => {
    if (!hasCreatePermission) {
      toast.error('You do not have permission to add images');
      return;
    }
    router.push('/addimagespage');
  };

  // Access denied screen
  if (!hasReadPermission) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-slate-400 mb-6">
            You don't have permission to view Images. Please contact your administrator.
          </p>
          <p className="text-xs text-slate-500 mb-6">
            Required permission: READ_IMAGE
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
          >
            Return to Dashboard
          </button>
        </div>
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          theme="dark"
          className="mt-16"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 overflow-auto">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        theme="dark"
        className="mt-16"
      />
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Image Gallery
            </h1>
            <p className="text-slate-400 text-sm">Manage and organize your image collection</p>
          </div>

          <div className="flex items-center gap-3">
            {hasCreatePermission && (
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                onClick={handleAddImage}
              >
                <Plus className="w-5 h-5" />
                Add Images
              </button>
            )}
            <button
              className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-white px-6 py-3 rounded-xl font-semibold border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 hover:scale-105"
              onClick={() => router.push('/ImagesCategoryPage')}
            >
              <Folder className="w-5 h-5" />
              Categories
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Total Images</span>
              <ImageIcon className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{data.count}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/30 backdrop-blur-sm border border-purple-700/30 rounded-xl p-5 hover:border-purple-600/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Current Page</span>
              <Grid3x3 className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">{data.current_page} / {data.total_pages}</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/30 backdrop-blur-sm border border-emerald-700/30 rounded-xl p-5 hover:border-emerald-600/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Showing</span>
              <Eye className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">{data.images.length}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 text-white border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={data.limit}
                onChange={handleLimitChange}
                className="px-4 py-3 bg-slate-900/50 text-white border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer"
              >
                <option value="12">12 per page</option>
                <option value="24">24 per page</option>
                <option value="36">36 per page</option>
                <option value="48">48 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="mt-6 text-slate-400 font-medium">Loading images...</p>
        </div>
      )}

      {/* Images Grid */}
      {!isLoading && (
        <>
          {data.images.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.images.map(item => (
                  <div
                    key={item.id}
                    className="group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/60 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/fallback-image.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60"></div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-md border border-blue-500/30">
                          {item.category_name || 'Uncategorized'}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-sm line-clamp-1 mb-3" title={item.name}>
                        {item.name}
                      </h3>
                      
                      {/* Action Buttons - Only show if user has permissions */}
                      {(hasUpdatePermission || hasDeletePermission) && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {hasUpdatePermission && (
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                updateRecord(item.id); 
                              }}
                              className="flex-1 p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg transition-all hover:scale-105"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 mx-auto" />
                            </button>
                          )}
                          {hasDeletePermission && (
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                deleteRecord(item.id); 
                              }}
                              className="flex-1 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-all hover:scale-105"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.total_pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pb-6">
                  <button
                    onClick={() => handlePageChange(data.current_page - 1)}
                    disabled={!data.previous}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      !data.previous
                        ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed border border-slate-700/30' 
                        : 'bg-slate-800/50 text-white hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
                      let pageNum;
                      if (data.total_pages <= 5) {
                        pageNum = i + 1;
                      } else if (data.current_page <= 3) {
                        pageNum = i + 1;
                      } else if (data.current_page >= data.total_pages - 2) {
                        pageNum = data.total_pages - 4 + i;
                      } else {
                        pageNum = data.current_page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            data.current_page === pageNum 
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(data.current_page + 1)}
                    disabled={!data.next}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      !data.next
                        ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed border border-slate-700/30' 
                        : 'bg-slate-800/50 text-white hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No images found</h3>
              <p className="text-slate-400 mb-6">Get started by adding your first image</p>
              {hasCreatePermission && (
                <button
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                  onClick={handleAddImage}
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Image
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImagesCom;