// 'use client';
// import React, { useEffect, useState, useContext } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AxiosInstance from "@/components/AxiosInstance";
// import { useRouter } from 'next/navigation';
// import { AuthContext } from '@/components/AuthContext';

// const BlogPostCom = () => {
//   const router = useRouter();
//   const { permissions = {} } = useContext(AuthContext);
//   const [blogPosts, setBlogPosts] = useState([]);
//   const [data, setData] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const recordsPerPage = 12;

//   useEffect(() => {
//     fetchBlogPosts();
//   }, [currentPage, statusFilter, categoryFilter]);

//   const fetchBlogPosts = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: currentPage,
//         limit: recordsPerPage,
//         offset: (currentPage - 1) * recordsPerPage,
//       };

//       if (statusFilter) params.status = statusFilter;
//       if (categoryFilter) params.category = categoryFilter;

//       const res = await AxiosInstance.get('/myapp/blogpost', { params });

//       console.log('API Response:', res.data);

//       if (res && res.data) {
//         // Handle the response structure: res.data.data.categories
//         const responseData = res.data.data || res.data;
        
//         const posts = responseData.categories || [];
//         setBlogPosts(posts);
//         setTotalPages(responseData.total_pages || 1);
//         setTotalCount(responseData.count || 0);
//         setData(res.data);
        
//         console.log('Blog posts loaded:', posts.length);
        
//         if (posts.length === 0) {
//           toast.info('No blog posts found');
//         }
//       } else {
//         console.error('Unexpected response structure:', res);
//         toast.error('Failed to load blog posts');
//       }
//     } catch (error) {
//       console.error('Error occurred:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
//       toast.error('Error fetching blog posts: ' + errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteBlogPost = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this blog post?')) {
//       return;
//     }

//     try {
//       const res = await AxiosInstance.delete(`/myapp/blogpost?id=${id}`);
//       if (res) {
//         toast.success('Blog post deleted successfully!');
//         // Refresh the list
//         fetchBlogPosts();
//       }
//     } catch (error) {
//       console.error('Delete error:', error);
//       toast.error('Error deleting blog post: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const updateBlogPost = (item) => {
//     router.push(`/updateblogpostpage?id=${item.id}`);
//   };

//   const viewBlogPost = (item) => {
//     router.push(`/blogdetailpage?id=${item.id}`);
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTerm(value);
//   };

//   // Filter records based on search term
//   const filteredBlogPosts = Array.isArray(blogPosts) ? blogPosts.filter((post) => {
//     const titleMatch = post.title?.toLowerCase().includes(searchTerm);
//     const authorMatch = post.author?.toLowerCase().includes(searchTerm);
//     const idMatch = post.id?.toString() === searchTerm;

//     return titleMatch || authorMatch || idMatch;
//   }) : [];

//   const getStatusBadgeColor = (status) => {
//     switch (status) {
//       case 'published':
//         return 'bg-green-500';
//       case 'draft':
//         return 'bg-yellow-500';
//       case 'archived':
//         return 'bg-gray-500';
//       case 'scheduled':
//         return 'bg-blue-500';
//       default:
//         return 'bg-gray-500';
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   return (
//     <div className="container mx-auto my-4 w-full bg-black ml-5">
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       <h2 className="text-3xl font-bold mb-6 text-white">Blog Post Management</h2>

//       {/* Add Blog Post Button */}
//       {permissions.create_blogpost !== false && (
//         <button
//           className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg mb-4 transition-colors"
//           onClick={() => router.push('/addblogpostpage')}
//         >
//           + Add New Blog Post
//         </button>
//       )}

//       {/* Stats and Filters Section */}
//       <div className="bg-gray-900 p-4 rounded-lg mb-5">
//         <div className="flex flex-wrap gap-4 items-center justify-between">
//           <div className="text-white">
//             <span className="text-lg font-semibold">Total Posts: </span>
//             <span className="text-xl text-blue-400">{totalCount}</span>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             {/* Search Bar */}
//             <input
//               type="text"
//               placeholder="Search by title, author, or ID..."
//               value={searchTerm}
//               onChange={handleSearch}
//               className="px-4 py-2 rounded-md border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             {/* Status Filter */}
//             <select
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="px-4 py-2 rounded-md border bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="published">Published</option>
//               <option value="draft">Draft</option>
//               <option value="archived">Archived</option>
//               <option value="scheduled">Scheduled</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center text-white py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//           <p className="mt-2">Loading blog posts...</p>
//         </div>
//       )}

//       {/* Blog Posts Table */}
//       {!loading && (
//         <div className="container mt-5 mr-10">
//           {filteredBlogPosts.length > 0 ? (
//             <div>
//               {/* Header Row */}
//               <div className="grid grid-cols-12 text-white font-bold bg-gray-900 p-4 rounded-t-lg gap-2">
//                 <span className="col-span-1">ID</span>
//                 <span className="col-span-3">Title</span>
//                 <span className="col-span-2">Author</span>
//                 <span className="col-span-2">Category</span>
//                 <span className="col-span-1">Status</span>
//                 <span className="col-span-1">Views</span>
//                 <span className="col-span-2">Published</span>
//               </div>

//               {/* Data Rows */}
//               <ul className="list-none">
//                 {filteredBlogPosts.map((post) => (
//                   <li key={post.id} className="bg-gray-800 border-t border-gray-700 mt-4">
//                     <div className="grid grid-cols-12 text-white p-4 gap-2 items-center hover:bg-gray-700 transition-colors">
//                       <span className="col-span-1 text-gray-400">{post.id}</span>
                      
//                       <div className="col-span-3">
//                         <div className="font-semibold text-blue-400 truncate" title={post.title}>
//                           {post.title}
//                         </div>
//                         {post.subtitle && (
//                           <div className="text-xs text-gray-400 truncate" title={post.subtitle}>
//                             {post.subtitle}
//                           </div>
//                         )}
//                       </div>

//                       <span className="col-span-2 truncate" title={post.author}>
//                         {post.author || 'Unknown'}
//                       </span>

//                       <span className="col-span-2 truncate" title={post.category_name}>
//                         {post.category_name || 'Uncategorized'}
//                       </span>

//                       <span className="col-span-1">
//                         <span className={`${getStatusBadgeColor(post.status)} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
//                           {post.status}
//                         </span>
//                       </span>

//                       <span className="col-span-1 text-gray-300">{post.view_count}</span>

//                       <span className="col-span-2 text-sm text-gray-400">
//                         {formatDate(post.published_at)}
//                       </span>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex justify-end gap-2 px-4 pb-3">
//                       <button
//                         className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm transition-colors"
//                         onClick={() => viewBlogPost(post)}
//                       >
//                         View
//                       </button>

//                       {permissions.update_blogpost !== false && (
//                         <button
//                           className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition-colors"
//                           onClick={() => updateBlogPost(post)}
//                         >
//                           Edit
//                         </button>
//                       )}

//                       {permissions.delete_blogpost !== false && (
//                         <button
//                           className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition-colors"
//                           onClick={() => deleteBlogPost(post.id)}
//                         >
//                           Delete
//                         </button>
//                       )}
//                     </div>
//                   </li>
//                 ))}
//               </ul>

//               {/* Pagination Controls */}
//               <div className="flex justify-center items-center gap-2 mt-4">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded ${
//                     currentPage === 1 
//                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
//                       : 'bg-blue-500 text-white hover:bg-blue-600'
//                   }`}
//                 >
//                   Previous
//                 </button>

//                 {Array.from({ length: totalPages }, (_, index) => (
//                   <button
//                     key={index + 1}
//                     onClick={() => setCurrentPage(index + 1)}
//                     className={`px-3 py-1 rounded ${
//                       currentPage === index + 1 
//                         ? 'bg-blue-500 text-white' 
//                         : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//                     }`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded ${
//                     currentPage === totalPages 
//                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
//                       : 'bg-blue-500 text-white hover:bg-blue-600'
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-gray-900 p-8 rounded-lg text-center">
//               <p className="text-white text-lg">No blog posts found.</p>
//               {permissions.create_blogpost !== false && (
//                 <button
//                   className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
//                   onClick={() => router.push('/addblogpostpage')}
//                 >
//                   Create Your First Blog Post
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogPostCom;




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

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage, statusFilter, categoryFilter]);

  // const fetchBlogPosts = async () => {
  //   setLoading(true);
  //   try {
  //     const params = {
  //       page: currentPage,
  //       limit: recordsPerPage,
  //       offset: (currentPage - 1) * recordsPerPage,
  //     };

  //     if (statusFilter) params.status = statusFilter;
  //     if (categoryFilter) params.category = categoryFilter;

  //     const res = await AxiosInstance.get('/api/myapp/v1/blog/posts/', { params });

  //     if (res && res.data) {
  //       const responseData = res.data.data || res.data;
  //       const posts = responseData.categories || [];
  //       setBlogPosts(posts);
  //       setTotalPages(responseData.total_pages || 1);
  //       setTotalCount(responseData.count || 0);
  //       setData(res.data);
        
  //       if (posts.length === 0) {
  //         toast.info('No blog posts found');
  //       }
  //     } else {
  //       toast.error('Failed to load blog posts');
  //     }
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
  //     toast.error('Error fetching blog posts: ' + errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBlogPosts = async () => {
  setLoading(true);
  let toastDisplayed = false; // Flag to track if toast has been shown
  
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
      
      if (posts.length === 0 && !toastDisplayed) {
        toast.info('No blog posts found');
        toastDisplayed = true;
      }
    } else if (!toastDisplayed) {
      toast.error('Failed to load blog posts');
      toastDisplayed = true;
    }
  } catch (error) {
    if (!toastDisplayed) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error('Error fetching blog posts: ' + errorMessage);
      toastDisplayed = true;
    }
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
        fetchBlogPosts();
      }
    } catch (error) {
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

          {permissions.create_blogpost !== false && (
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
              onClick={() => router.push('/addblogpostpage')}
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

                        {permissions.update_blogpost !== false && (
                          <button
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg transition-all hover:scale-105"
                            onClick={() => updateBlogPost(post)}
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                        )}

                        {permissions.delete_blogpost !== false && (
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
            </>
          ) : (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No blog posts found</h3>
              <p className="text-slate-400 mb-6">Get started by creating your first blog post</p>
              {permissions.create_blogpost !== false && (
                <button
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                  onClick={() => router.push('/addblogpostpage')}
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