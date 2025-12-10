import React, { useState, useEffect } from 'react';
import { usePopup } from '../../context/PopupContext';
import { getAllBlogs, likeBlog, deleteBlog, getBlogsByTagId } from '../../api/blogApi';
import { getAllTags } from '../../api/tagApi';
import { getAllUserBlogs } from '../../api/userBlogApi';
import { getAllArtists } from '../../api/artistApi';
import { addComment, getCommentsByBlogId } from '../../api/commentApi';
import { getAllUserComments } from '../../api/userCommentApi';
import { Hexagon, MessageCircle, Share2, FileQuestion, ArrowUpDown, Trash2, Edit2 } from 'lucide-react';
import '../../styles/ArtistBlogs.css'; // Reuse basic card styles
import '../../styles/BlogsFeed.css'; // New dedicated styles
import '../../styles/TagSelector.css'; // Shared tag styles

import SearchBar from '../common/SearchBar'; // Import generic SearchBar
import FilterSort from '../common/FilterSort';
import TagList from '../common/TagList';
import BlogCard from './BlogCard';

function BlogsFeed({ onNavigate, currentUser, initialData }) {
    const { showAlert, showConfirm } = usePopup();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
    const [searchQuery, setSearchQuery] = useState(''); // New State for Search
    const [activeCommentBlogId, setActiveCommentBlogId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentsMap, setCommentsMap] = useState({}); // blogId -> comments[]
    const [artistsMap, setArtistsMap] = useState({}); // artistId -> Artist
    const [commentUserMap, setCommentUserMap] = useState({}); // commentId -> artistId

    // Tag Filtering State
    const [allTags, setAllTags] = useState([]);
    const [selectedTagIds, setSelectedTagIds] = useState([]); // Changed to Array

    useEffect(() => {
        // Fetch Tags
        getAllTags().then(tags => setAllTags(tags || []));
    }, []);

    useEffect(() => {
        if (initialData?.tagId) {
            setSelectedTagIds([initialData.tagId]);
            setSearchQuery('');
        }
    }, [initialData]);

    useEffect(() => {
        fetchData();
    }, [currentUser]); // Removed selectedTagIds dependency as we filter client side for multi-select

    const fetchData = async () => {
        setLoading(true);
        try {
            const userId = currentUser?.artistId || 0;

            // Always fetch ALL blogs to enable client-side multi-filtering
            // This is acceptable for the expected scale of "Community Blogs"
            const blogsPromise = getAllBlogs(userId);

            const [blogsData, artistsData] = await Promise.all([
                blogsPromise,
                getAllArtists(),
            ]);

            // Map artists by ID for quick lookup
            const aMap = {};
            artistsData.forEach(artist => {
                aMap[artist.artistId] = artist;
            });
            setArtistsMap(aMap);

            // Combine data
            const enrichedBlogs = blogsData.map(blog => {
                // Use new direct Author relationship
                let artist = blog.author;

                // Fallback to finding by ID if author object is incomplete but has ID (defensive)
                if (!artist && blog.authorId) {
                    artist = aMap[blog.authorId];
                }

                return {
                    ...blog,
                    artist: artist || { name: 'Unknown Artist', profileImage: null }
                };
            });

            setBlogs(enrichedBlogs);
        } catch (error) {
            console.error("Failed to fetch blogs feed", error);
        } finally {
            setLoading(false);
        }
    };

    // Sort blogs based on sortOrder
    const sortedBlogs = React.useMemo(() => {
        return [...blogs].sort((a, b) => {
            const dateA = new Date(a.datePosted || 0).getTime();
            const dateB = new Date(b.datePosted || 0).getTime();
            if (sortOrder === 'newest') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });
    }, [blogs, sortOrder]);

    const filteredAndSortedBlogs = React.useMemo(() => {
        return sortedBlogs
            .filter(blog => {
                // 1. Search Query
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    if (!(
                        blog.title?.toLowerCase().includes(query) ||
                        blog.content?.toLowerCase().includes(query) ||
                        blog.artist?.name?.toLowerCase().includes(query)
                    )) {
                        return false;
                    }
                }

                // 2. Tag Filter (Multi-select) - AND Logic (must have ALL selected tags)
                if (selectedTagIds.length > 0) {
                    if (!blog.blogTags || blog.blogTags.length === 0) return false;

                    // Get tag names from blogTags (BlogTagEntity -> tag -> name)
                    const blogTagNames = blog.blogTags.map(bt => bt.tag?.name);

                    // Get selected tag names
                    const selectedTagNames = selectedTagIds.map(id => allTags.find(t => t.tagId === id)?.name);

                    // Check if blog has all selected tags
                    const hasAllTags = selectedTagNames.every(name => blogTagNames.includes(name));
                    if (!hasAllTags) return false;
                }

                return true;
            });
    }, [sortedBlogs, searchQuery, selectedTagIds, allTags]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleLike = async (blogId) => {
        const user = currentUser || JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) {
            showAlert("Login Required", "Please login to like");
            return;
        }

        // Optimistic update
        setBlogs(prev => prev.map(b => {
            if (b.blogId === blogId) {
                const wasLiked = b.isLiked;
                return {
                    ...b,
                    isLiked: !wasLiked,
                    likeCount: wasLiked ? Math.max(0, (b.likeCount || 0) - 1) : (b.likeCount || 0) + 1
                };
            }
            return b;
        }));

        try {
            const updatedBlog = await likeBlog(blogId, user.artistId);
            // Re-sync with server response to be sure
            setBlogs(prev => prev.map(b => {
                if (b.blogId === blogId) {
                    return {
                        ...b,
                        likeCount: updatedBlog.likeCount,
                        isLiked: updatedBlog.isLiked
                    };
                }
                return b;
            }));
        } catch (error) {
            console.error("Failed to like blog", error);
            fetchData();
        }
    };

    const toggleComments = async (blogId) => {
        if (activeCommentBlogId === blogId) {
            setActiveCommentBlogId(null);
        } else {
            setActiveCommentBlogId(blogId);
            if (!commentsMap[blogId]) {
                try {
                    const comments = await getCommentsByBlogId(blogId);
                    setCommentsMap(prev => ({ ...prev, [blogId]: comments }));
                } catch (error) {
                    console.error("Failed to fetch comments", error);
                }
            }
        }
    };

    const handleAddComment = async (blogId) => {
        if (!commentText.trim()) return;
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) {
            showAlert("Login Required", "Please login to comment");
            return;
        }
        try {
            const newComment = await addComment(blogId, user.artistId, commentText);

            // Update local maps for the new comment
            setCommentUserMap(prev => ({ ...prev, [newComment.commentId]: user.artistId }));

            setCommentsMap(prev => ({
                ...prev,
                [blogId]: [...(prev[blogId] || []), newComment]
            }));
            setCommentText('');
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleDelete = (blogId) => {
        showConfirm(
            "Delete Blog",
            "Are you sure you want to delete this blog?",
            async () => {
                try {
                    const user = currentUser || JSON.parse(localStorage.getItem('currentArtist'));
                    await deleteBlog(blogId, user.artistId);
                    setBlogs(prev => prev.filter(b => b.blogId !== blogId));
                } catch (error) {
                    console.error("Failed to delete blog", error);
                    showAlert("Error", "Failed to delete blog");
                }
            }
        );
    };

    const handleEdit = (blog) => {
        // Assuming onNavigate allows passing data, otherwise this needs App.js support.
        // Calling onNavigate with data object if supported, or assuming some other state management.
        // If onNavigate only accepts string, this might fail to pass data.
        // Logic for now:
        if (onNavigate) onNavigate('upload-blog', { blogToEdit: blog });
    };

    const handleShare = (blogId) => {
        const url = `${window.location.origin}/blog/${blogId}`;
        navigator.clipboard.writeText(url);
        showAlert(
            "Share Blog",
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ margin: 0 }}>Link copied to clipboard!</p>
                <input
                    type="text"
                    value={url}
                    readOnly
                    className="input-hexagon"
                    style={{ width: '100%', padding: '8px' }}
                />
            </div>
        );
    };

    if (loading) return <div style={{ color: 'var(--primary-color)', textAlign: 'center', marginTop: '50px' }}>Loading blogs...</div>;

    return (
        <div className="blogs-feed-container">
            <h1 style={{ marginBottom: '20px', color: 'var(--primary-color)', fontFamily: 'var(--font-family)' }}>Community Blogs</h1>
            {/* Search & Create Header (Top Row) */}
            <div className="search-bar-container" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                    <SearchBar
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search discussions..."
                    />
                </div>
                <button
                    onClick={() => onNavigate('upload-blog')}
                    className="button-hexagon"
                    style={{ whiteSpace: 'nowrap', height: '48px', display: 'flex', alignItems: 'center' }}
                >
                    + Create Blog
                </button>
            </div>

            {/* Filter Sort Bar (Dark Bar) */}
            <div className="blogs-filter-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <FilterSort
                        type="blog"
                        sortOptions={[
                            { label: 'Newest First', value: 'newest' },
                            { label: 'Oldest First', value: 'oldest' },
                        ]}
                        activeSort={sortOrder}
                        onSortChange={setSortOrder}
                        showFilter={true}
                        filterOptions={allTags}
                        activeFilters={selectedTagIds}
                        onFilterChange={setSelectedTagIds}
                        onClear={() => {
                            setSortOrder('newest');
                            setSelectedTagIds([]);
                            setSearchQuery('');
                        }}
                    />

                    {selectedTagIds.length > 0 && (
                        <span style={{ color: 'var(--primary-color)', fontSize: '14px' }}>
                            Filtering by: <b>
                                {selectedTagIds.map(id => allTags.find(t => t.tagId === id)?.name).join(', ')}
                            </b>
                        </span>
                    )}
                </div>
            </div>

            <div className="blog-list">
                {filteredAndSortedBlogs.length > 0 ? (
                    filteredAndSortedBlogs.map((blog) => (
                        <BlogCard
                            key={blog.blogId}
                            blog={blog}
                            currentUser={currentUser}
                            isOpen={activeCommentBlogId === blog.blogId}
                            onToggle={(id) => toggleComments(id)}
                            comments={commentsMap[blog.blogId]}
                            onLike={handleLike}
                            onShare={handleShare}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onAddComment={handleAddComment}
                            commentText={commentText}
                            setCommentText={setCommentText}
                            commentUserMap={commentUserMap}
                            artistsMap={artistsMap}
                            onTagClick={(tag) => {
                                if (!selectedTagIds.includes(tag.tagId)) {
                                    setSelectedTagIds([...selectedTagIds, tag.tagId]);
                                }
                            }}
                            selectedTagIds={selectedTagIds}
                            onNavigate={onNavigate}
                        />
                    ))
                ) : (
                    <div className="no-blogs-container">
                        <span className="no-blogs-icon"><FileQuestion size={48} /></span>
                        <h3 className="no-blogs-title">No blogs found</h3>
                        <p className="no-blogs-text">Try adjusting your filters or search.</p>
                    </div>
                )}
            </div>
        </div >
    );
}

export default BlogsFeed;
