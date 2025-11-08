'use client';
import React, { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthContext';

const BlogPostCom = () => {
  const router = useRouter();
  const { permissions = {} } = useContext(AuthContext);
  const [blogPosts, setBlogPosts] = useState([]);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 12;

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage, statusFilter, categoryFilter]);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: recordsPerPage,
        offset: (currentPage - 1) * recordsPerPage,
      };

      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await AxiosInstance.get('/myapp/blogpost', { params });

      console.log('API Response:', res.data);

      if (res && res.data) {
        // Handle the response structure: res.data.data.categories
        const responseData = res.data.data || res.data;
        
        const posts = responseData.categories || [];
        setBlogPosts(posts);
        setTotalPages(responseData.total_pages || 1);
        setTotalCount(responseData.count || 0);
        setData(res.data);
        
        console.log('Blog posts loaded:', posts.length);
        
        if (posts.length === 0) {
          toast.info('No blog posts found');
        }
      } else {
        console.error('Unexpected response structure:', res);
        toast.error('Failed to load blog posts');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error('Error fetching blog posts: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const res = await AxiosInstance.delete(`/myapp/blogpost?id=${id}`);
      if (res) {
        toast.success('Blog post deleted successfully!');
        // Refresh the list
        fetchBlogPosts();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting blog post: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateBlogPost = (item) => {
    router.push(`/updateblogpostpage?id=${item.id}`);
  };

  const viewBlogPost = (item) => {
    router.push(`/blogdetailpage?id=${item.id}`);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  // Filter records based on search term
  const filteredBlogPosts = Array.isArray(blogPosts) ? blogPosts.filter((post) => {
    const titleMatch = post.title?.toLowerCase().includes(searchTerm);
    const authorMatch = post.author?.toLowerCase().includes(searchTerm);
    const idMatch = post.id?.toString() === searchTerm;

    return titleMatch || authorMatch || idMatch;
  }) : [];

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'archived':
        return 'bg-gray-500';
      case 'scheduled':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto my-4 w-full bg-black ml-5">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h2 className="text-3xl font-bold mb-6 text-white">Blog Post Management</h2>

      {/* Add Blog Post Button */}
      {permissions.create_blogpost !== false && (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg mb-4 transition-colors"
          onClick={() => router.push('/addblogpostpage')}
        >
          + Add New Blog Post
        </button>
      )}

      {/* Stats and Filters Section */}
      <div className="bg-gray-900 p-4 rounded-lg mb-5">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="text-white">
            <span className="text-lg font-semibold">Total Posts: </span>
            <span className="text-xl text-blue-400">{totalCount}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by title, author, or ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 rounded-md border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-md border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-white py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2">Loading blog posts...</p>
        </div>
      )}

      {/* Blog Posts Table */}
      {!loading && (
        <div className="container mt-5 mr-10">
          {filteredBlogPosts.length > 0 ? (
            <div>
              {/* Header Row */}
              <div className="grid grid-cols-12 text-white font-bold bg-gray-900 p-4 rounded-t-lg gap-2">
                <span className="col-span-1">ID</span>
                <span className="col-span-3">Title</span>
                <span className="col-span-2">Author</span>
                <span className="col-span-2">Category</span>
                <span className="col-span-1">Status</span>
                <span className="col-span-1">Views</span>
                <span className="col-span-2">Published</span>
              </div>

              {/* Data Rows */}
              <ul className="list-none">
                {filteredBlogPosts.map((post) => (
                  <li key={post.id} className="bg-gray-800 border-t border-gray-700 mt-4">
                    <div className="grid grid-cols-12 text-white p-4 gap-2 items-center hover:bg-gray-700 transition-colors">
                      <span className="col-span-1 text-gray-400">{post.id}</span>
                      
                      <div className="col-span-3">
                        <div className="font-semibold text-blue-400 truncate" title={post.title}>
                          {post.title}
                        </div>
                        {post.subtitle && (
                          <div className="text-xs text-gray-400 truncate" title={post.subtitle}>
                            {post.subtitle}
                          </div>
                        )}
                      </div>

                      <span className="col-span-2 truncate" title={post.author}>
                        {post.author || 'Unknown'}
                      </span>

                      <span className="col-span-2 truncate" title={post.category_name}>
                        {post.category_name || 'Uncategorized'}
                      </span>

                      <span className="col-span-1">
                        <span className={`${getStatusBadgeColor(post.status)} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                          {post.status}
                        </span>
                      </span>

                      <span className="col-span-1 text-gray-300">{post.view_count}</span>

                      <span className="col-span-2 text-sm text-gray-400">
                        {formatDate(post.published_at)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 px-4 pb-3">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm transition-colors"
                        onClick={() => viewBlogPost(post)}
                      >
                        View
                      </button>

                      {permissions.update_blogpost !== false && (
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors"
                          onClick={() => updateBlogPost(post)}
                        >
                          Edit
                        </button>
                      )}

                      {permissions.delete_blogpost !== false && (
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition-colors"
                          onClick={() => deleteBlogPost(post.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 p-8 rounded-lg text-center">
              <p className="text-white text-lg">No blog posts found.</p>
              {permissions.create_blogpost !== false && (
                <button
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
                  onClick={() => router.push('/addblogpostpage')}
                >
                  Create Your First Blog Post
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPostCom;