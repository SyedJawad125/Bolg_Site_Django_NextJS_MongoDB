'use client';
import React, { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthContext';

const ImagesCategoryCom = () => {
  const router = useRouter();
  const { permissions = {}, user } = useContext(AuthContext);
  
  const [data, setData] = useState({
    categories: [],
    count: 0,
    current_page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log('Component mounted, fetching categories...');
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setDebugInfo('Starting fetch...');
    
    try {
      const url = `/api/images/v1/categories/?page=${data.current_page}&limit=${data.limit}`;
      console.log('Making API call to:', url);
      setDebugInfo(`Calling: ${url}`);
      
      const res = await AxiosInstance.get(url);
      
      console.log('=== FULL RESPONSE ===');
      console.log('res:', res);
      console.log('res.data:', res.data);
      console.log('res.data.data:', res.data.data);
      console.log('res.data.message:', res.data.message);
      console.log('res.data.count:', res.data.count);
      console.log('Type of res.data:', typeof res.data);
      console.log('Type of res.data.data:', typeof res.data.data);
      console.log('Is Array:', Array.isArray(res.data.data));
      
      setDebugInfo(`Response received: ${JSON.stringify(res.data, null, 2)}`);
      
      // Handle different possible response structures
      let categories = [];
      let count = 0;
      
      if (res.data) {
        // Check if data is in res.data.data
        if (res.data.data && Array.isArray(res.data.data)) {
          categories = res.data.data;
          count = res.data.count || res.data.data.length;
          console.log('✅ Found data in res.data.data');
        }
        // Check if data is directly in res.data and it's an array
        else if (Array.isArray(res.data)) {
          categories = res.data;
          count = res.data.length;
          console.log('✅ Found data directly in res.data');
        }
        // Check if there's a different structure
        else {
          console.log('❌ Unexpected data structure:', res.data);
          setDebugInfo(`Unexpected structure: ${JSON.stringify(Object.keys(res.data))}`);
        }
      }
      
      console.log('Final categories to set:', categories);
      console.log('Final count to set:', count);
      
      setData(prev => ({
        ...prev,
        categories: categories,
        count: count
      }));
      
      console.log('State update completed');
      
      if (categories.length > 0) {
        toast.success(`Loaded ${categories.length} categories`);
      } else {
        toast.info('No categories found');
      }
      
    } catch (error) {
      console.error('=== ERROR DETAILS ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      setDebugInfo(`Error: ${error.message}`);
      toast.error('Error fetching categories: ' + error.message);
    } finally {
      setIsLoading(false);
      console.log('Loading complete');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      const res = await AxiosInstance.delete(`/api/images/v1/categories/?id=${id}`);
      if (res.data.status_code === 200 || res.data.message === "Successful") {
        toast.success('Category deleted successfully!');
        fetchCategories();
      } else {
        toast.error(res.data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting category!');
    }
  };

  const updateCategory = async (id) => {
    router.push(`/UpdateImagesCategoryPage?id=${id}`);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      fetchCategories();
      return;
    }

    try {
      const res = await AxiosInstance.get(`/api/images/v1/categories/?search=${value}`);
      console.log('Search response:', res.data);
      
      let categories = [];
      let count = 0;
      
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        categories = res.data.data;
        count = res.data.count || res.data.data.length;
      } else if (Array.isArray(res.data)) {
        categories = res.data;
        count = res.data.length;
      }
      
      setData(prev => ({
        ...prev,
        categories: categories,
        count: count,
        current_page: 1
      }));
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error searching categories');
    }
  };

  const handlePageChange = (page) => {
    console.log('Changing page to:', page);
    setData(prev => ({
      ...prev,
      current_page: page
    }));
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    console.log('Changing limit to:', newLimit);
    setData(prev => ({
      ...prev,
      limit: newLimit,
      current_page: 1
    }));
  };

  const total_pages = Math.ceil(data.count / data.limit);

  console.log('=== RENDER STATE ===');
  console.log('categories:', data.categories);
  console.log('categories.length:', data.categories.length);
  console.log('count:', data.count);
  console.log('isLoading:', isLoading);

  if (!permissions.read_images_category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl text-amber-400 mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">
            You don't have permission to view Images. Please contact your administrator.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-amber-600 rounded-full hover:bg-amber-700 text-white transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400">Images Categories Management</h1>
        {permissions.create_images_category && (
          <button 
            onClick={() => router.push('/AddImagesCategoryPage')}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-full shadow-md transition"
          >
            Add Category
          </button>
        )}
      </div>

      {/* Enhanced Debug Info Panel */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 border-2 border-amber-500">
        <h3 className="text-amber-400 font-semibold mb-2">🔍 Debug Information:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
          <div>Categories Length: <span className="text-amber-400 font-bold">{data.categories.length}</span></div>
          <div>Total Count: <span className="text-amber-400 font-bold">{data.count}</span></div>
          <div>Current Page: <span className="text-amber-400 font-bold">{data.current_page}</span></div>
          <div>Items per Page: <span className="text-amber-400 font-bold">{data.limit}</span></div>
        </div>
        <div className="bg-black p-2 rounded text-xs mb-2">
          <div className="text-green-400">Loading: {isLoading ? 'YES' : 'NO'}</div>
          <div className="text-blue-400">Has Data: {data.categories.length > 0 ? 'YES' : 'NO'}</div>
          <div className="text-purple-400">Is Array: {Array.isArray(data.categories) ? 'YES' : 'NO'}</div>
        </div>
        {data.categories.length > 0 && (
          <div className="mt-2 text-xs bg-green-900 p-2 rounded">
            <strong>Category IDs:</strong> {data.categories.map(cat => cat.id).join(', ')}
            <br />
            <strong>First Category:</strong> {JSON.stringify(data.categories[0], null, 2)}
          </div>
        )}
        {debugInfo && (
          <div className="mt-2 text-xs bg-blue-900 p-2 rounded overflow-auto max-h-40">
            <pre>{debugInfo}</pre>
          </div>
        )}
      </div>

      {/* Search + Limit */}
      <div className="bg-gray-900 p-4 rounded-xl mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-1/2 px-4 py-2 rounded-md bg-black border border-amber-500 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <div className="flex items-center gap-2 text-gray-300">
            <label>Items per page:</label>
            <select
              value={data.limit}
              onChange={handleLimitChange}
              className="bg-black border border-amber-500 px-3 py-1 rounded-md text-white focus:outline-none"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-xl">
        {isLoading ? (
          <div className="text-center p-10 bg-gray-900 rounded-lg">
            <div className="animate-spin h-12 w-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading categories...</p>
          </div>
        ) : (
          <>
            <div className="bg-yellow-900 text-yellow-200 p-3 mb-2 rounded text-sm">
              ⚠️ Rendering table with {data.categories.length} items
            </div>
            
            <table className="min-w-full divide-y divide-amber-500 bg-gray-950">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-amber-400">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-amber-400">Category Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-amber-400">Images Count</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-amber-400">Created By</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-amber-400">Created At</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-amber-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {data.categories.length > 0 ? (
                  data.categories.map((category, index) => {
                    console.log(`Rendering row ${index}:`, category);
                    return (
                      <tr key={category.id || index} className="hover:bg-gray-800 transition">
                        <td className="px-6 py-4 text-sm text-gray-300">{category.id}</td>
                        <td className="px-6 py-4 text-sm text-white font-medium">{category.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{category.images_count}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {category.created_by?.full_name || 'System'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(category.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 space-x-4">
                          {permissions.update_images_category && (
                            <button
                              onClick={() => updateCategory(category.id)}
                              className="text-amber-400 hover:underline"
                            >
                              Edit
                            </button>
                          )}
                          {permissions.delete_images_category && (
                            <button
                              onClick={() => deleteCategory(category.id)}
                              className="text-red-400 hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center px-6 py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-bold text-red-400">No categories found</p>
                        <p className="text-sm mt-2">API returned {data.count} items but array is empty</p>
                        <p className="text-xs mt-2 text-gray-600">Check console and debug panel above</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {total_pages > 1 && (
              <div className="flex items-center justify-between mt-6 text-gray-300 bg-gray-900 p-4 rounded">
                <div>
                  Showing <span className="text-amber-400">{(data.current_page - 1) * data.limit + 1}</span> to{' '}
                  <span className="text-amber-400">{Math.min(data.current_page * data.limit, data.count)}</span> of{' '}
                  <span className="text-amber-400">{data.count}</span> results
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={data.current_page === 1}
                    className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-30"
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.max(1, data.current_page - 1))}
                    disabled={data.current_page === 1}
                    className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-30"
                  >
                    Prev
                  </button>

                  {Array.from({ length: Math.min(5, total_pages) }, (_, i) => {
                    let pageNum;
                    if (total_pages <= 5) {
                      pageNum = i + 1;
                    } else if (data.current_page <= 3) {
                      pageNum = i + 1;
                    } else if (data.current_page >= total_pages - 2) {
                      pageNum = total_pages - 4 + i;
                    } else {
                      pageNum = data.current_page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded ${
                          data.current_page === pageNum
                            ? 'bg-amber-500 text-black'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(Math.min(total_pages, data.current_page + 1))}
                    disabled={data.current_page === total_pages}
                    className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-30"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(total_pages)}
                    disabled={data.current_page === total_pages}
                    className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-30"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImagesCategoryCom;