'use client';
import React, { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthContext';
import { Search, Plus, Filter, Eye, Edit2, Trash2, Calendar, User, Folder, TrendingUp } from 'lucide-react';

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

  // Check for permissions - try multiple possible permission names
  const hasReadPermission = permissions.read_blog_post || permissions.READ_BLOG_POST;
  const hasCreatePermission = permissions.create_blog_post || permissions.CREATE_BLOG_POST;
  const hasUpdatePermission = permissions.update_blog_post || permissions.UPDATE_BLOG_POST;
  const hasDeletePermission = permissions.delete_blog_post || permissions.DELETE_BLOG_POST;

  useEffect(() => {
    if (hasReadPermission) {
      fetchBlogPosts();
    }
  }, [currentPage, statusFilter, categoryFilter, hasReadPermission]);

  const fetchBlogPosts = async () => {
    if (!hasReadPermission) {
      toast.error('You do not have permission to view blog posts');
      return;
    }

    setLoading(true);
    
    try {
      const params = {
        page: currentPage,
        limit: recordsPerPage,
        offset: (currentPage - 1) * recordsPerPage,
      };

      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await AxiosInstance.get('/api/myapp/v1/blog/posts/', { params });

      if (res && res.data) {
        const responseData = res.data.data || res.data;
        const posts = responseData.categories || [];
        setBlogPosts(posts);
        setTotalPages(responseData.total_pages || 1);
        setTotalCount(responseData.count || 0);
        setData(res.data);
        
        if (posts.length === 0) {
          toast.info('No blog posts found');
        }
      } else {
        toast.error('Failed to load blog posts');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view blog posts');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        toast.error('Error fetching blog posts: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (id) => {
    if (!hasDeletePermission) {
      toast.error('You do not have permission to delete blog posts');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const res = await AxiosInstance.delete(`/myapp/blogpost?id=${id}`);
      if (res) {
        toast.success('Blog post deleted successfully!');
        fetchBlogPosts();
      }
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete blog posts');
      } else {
        toast.error('Error deleting blog post: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const updateBlogPost = (item) => {
    if (!hasUpdatePermission) {
      toast.error('You do not have permission to update blog posts');
      return;
    }
    router.push(`/updateblogpostpage?id=${item.id}`);
  };

  const viewBlogPost = (item) => {
    router.push(`/blogdetailpage?id=${item.id}`);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  const handleAddBlogPost = () => {
    if (!hasCreatePermission) {
      toast.error('You do not have permission to create blog posts');
      return;
    }
    router.push('/addblogpostpage');
  };

  const filteredBlogPosts = Array.isArray(blogPosts) ? blogPosts.filter((post) => {
    const titleMatch = post.title?.toLowerCase().includes(searchTerm);
    const authorMatch = post.author?.toLowerCase().includes(searchTerm);
    const idMatch = post.id?.toString() === searchTerm;
    return titleMatch || authorMatch || idMatch;
  }) : [];

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'draft':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'archived':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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
            You don't have permission to view Blog Posts. Please contact your administrator.
          </p>
          <p className="text-xs text-slate-500 mb-6">
            Required permission: READ_BLOG_POST
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
              Blog Management
            </h1>
            <p className="text-slate-400 text-sm">Manage and organize your blog content</p>
          </div>

          {hasCreatePermission && (
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
              onClick={handleAddBlogPost}
            >
              <Plus className="w-5 h-5" />
              Create Post
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Total Posts</span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{totalCount}</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/30 backdrop-blur-sm border border-emerald-700/30 rounded-xl p-5 hover:border-emerald-600/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Published</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-3xl font-bold text-emerald-400">
              {blogPosts.filter(p => p.status === 'published').length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/20 to-amber-950/30 backdrop-blur-sm border border-amber-700/30 rounded-xl p-5 hover:border-amber-600/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Drafts</span>
              <Edit2 className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-amber-400">
              {blogPosts.filter(p => p.status === 'draft').length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/30 backdrop-blur-sm border border-purple-700/30 rounded-xl p-5 hover:border-purple-600/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Pages</span>
              <Folder className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-400">{totalPages}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, author, or ID..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 text-white border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 bg-slate-900/50 text-white border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer"
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
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="mt-6 text-slate-400 font-medium">Loading blog posts...</p>
        </div>
      )}

      {/* Blog Posts List */}
      {!loading && (
        <div className="space-y-4">
          {filteredBlogPosts.length > 0 ? (
            <>
              {filteredBlogPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/60 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title & ID */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-slate-700/50 text-slate-400 text-xs font-mono rounded-md border border-slate-600/30">
                            #{post.id}
                          </span>
                          <h3 className="text-xl font-bold text-white truncate flex-1" title={post.title}>
                            {post.title}
                          </h3>
                        </div>

                        {/* Subtitle */}
                        {post.subtitle && (
                          <p className="text-slate-400 text-sm mb-4 line-clamp-2" title={post.subtitle}>
                            {post.subtitle}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-400">
                            <User className="w-4 h-4" />
                            <span>{post.author || 'Unknown'}</span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            <Folder className="w-4 h-4" />
                            <span>{post.category_name || 'Uncategorized'}</span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.published_at)}</span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            <Eye className="w-4 h-4" />
                            <span>{post.view_count} views</span>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(post.status)}`}>
                            {post.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all hover:scale-105"
                          onClick={() => viewBlogPost(post)}
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {hasUpdatePermission && (
                          <button
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg transition-all hover:scale-105"
                            onClick={() => updateBlogPost(post)}
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                        )}

                        {hasDeletePermission && (
                          <button
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-all hover:scale-105"
                            onClick={() => deleteBlogPost(post.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pb-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === 1 
                        ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed border border-slate-700/30' 
                        : 'bg-slate-800/50 text-white hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = index + 1;
                      } else if (currentPage <= 3) {
                        pageNum = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + index;
                      } else {
                        pageNum = currentPage - 2 + index;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === pageNum 
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === totalPages 
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
                <Folder className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No blog posts found</h3>
              <p className="text-slate-400 mb-6">Get started by creating your first blog post</p>
              {hasCreatePermission && (
                <button
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                  onClick={handleAddBlogPost}
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Post
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