import React, { useState, useEffect, useMemo } from 'react';
import { usePopup } from '../../context/PopupContext';
import { likeBlog, deleteBlog } from '../../api/blogApi';
import { addComment, getCommentsByBlogId } from '../../api/commentApi';
import { getAllArtists } from '../../api/artistApi';
import { getAllTags } from '../../api/tagApi';
import { Hexagon, MessageCircle, Share2, FileQuestion, Trash2 } from 'lucide-react';
import FilterSort from '../common/FilterSort';
import SearchBar from '../common/SearchBar';
import BlogCard from '../blogs/BlogCard';
import '../../styles/ArtistBlogs.css';
import '../../styles/BlogsFeed.css'; // For filter styles

function ArtistBlogs({ blogs, artist, onNavigate, currentUser }) {
    const { showAlert, showConfirm } = usePopup();
    // Sort blogs by most recent first
    const [sortOrder, setSortOrder] = useState('newest');

    const sortedBlogs = useMemo(() => {
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

    const [activeCommentBlogId, setActiveCommentBlogId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentsMap, setCommentsMap] = useState({}); // blogId -> comments[]
    const [localBlogs, setLocalBlogs] = useState(sortedBlogs); // To update like counts locally
    const [artistsMap, setArtistsMap] = useState({}); // artistId -> Artist
    const [commentUserMap, setCommentUserMap] = useState({}); // commentId -> artistId

    // Update localBlogs when props change
    useEffect(() => {
        setLocalBlogs(sortedBlogs);
    }, [blogs, sortOrder]);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const artistsData = await getAllArtists();
            const aMap = {};
            artistsData.forEach(artist => {
                aMap[artist.artistId] = artist;
            });
            setArtistsMap(aMap);
        } catch (error) {
            console.error("Failed to fetch artist data", error);
        }
    };

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
        const user = JSON.parse(localStorage.getItem('currentArtist'));
        if (!user) {
            showAlert("Login Required", "Please login to like");
            return;
        }
        try {
            const updatedBlog = await likeBlog(blogId, user.artistId);
            setLocalBlogs(prev => prev.map(b => b.blogId === blogId ? { ...b, likeCount: updatedBlog.likeCount, isLiked: updatedBlog.isLiked } : b));
        } catch (error) {
            console.error("Failed to like blog", error);
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

            // Update local maps
            // setCommentUserMap(prev => ({ ...prev, [newComment.commentId]: user.artistId })); // Removed legacy map

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
                    const user = JSON.parse(localStorage.getItem('currentArtist'));
                    if (!user) return;
                    await deleteBlog(blogId, user.artistId);
                    setLocalBlogs(prev => prev.filter(b => b.blogId !== blogId));
                } catch (error) {
                    console.error("Failed to delete blog", error);
                    showAlert("Error", "Failed to delete blog");
                }
            }
        );
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

    const handleEdit = (blog) => {
        if (onNavigate) onNavigate('upload-blog', { blogToEdit: blog });
    };

    const [allTags, setAllTags] = useState([]);
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTags = async () => {
            const tags = await getAllTags();
            setAllTags(tags || []);
        };
        fetchTags();
    }, []);

    const filteredAndSortedBlogs = useMemo(() => {
        let result = [...sortedBlogs];

        // Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(blog =>
                blog.title.toLowerCase().includes(lowerQuery) ||
                blog.content.toLowerCase().includes(lowerQuery) ||
                blog.artist?.name.toLowerCase().includes(lowerQuery) ||
                blog.artist?.username?.toLowerCase().includes(lowerQuery)
            );
        }

        // Tag Filter
        if (selectedTagIds.length > 0) {
            result = result.filter(blog => {
                // Handle both direct tags array and blogTags associative array
                const tags = blog.tags || (blog.blogTags ? blog.blogTags.map(bt => bt.tag) : []);
                const blogTagIds = tags.map(t => t.tagId);
                return selectedTagIds.every(id => blogTagIds.includes(id));
            });
        }

        return result;
    }, [sortedBlogs, searchQuery, selectedTagIds]);

    return (
        <div className="artist-blogs-container">
            <div className="artist-blogs-header">
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
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
                    <div style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
                        <SearchBar
                            placeholder="Search blogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {JSON.parse(localStorage.getItem('currentArtist'))?.artistId === artist?.artistId && (
                    <button
                        onClick={() => onNavigate && onNavigate('upload-blog')}
                        className="button-hexagon upload-blog-btn"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        + Upload Blog
                    </button>
                )}
            </div>

            {/* Active Filters Display */}
            {selectedTagIds.length > 0 && (
                <div style={{ marginBottom: '20px', color: 'var(--primary-color)', fontSize: '14px' }}>
                    Filtering by: <b>
                        {selectedTagIds.map(id => allTags.find(t => t.tagId === id)?.name).join(', ')}
                    </b>
                </div>
            )}

            {filteredAndSortedBlogs.length > 0 ? (
                <div className="blog-list">
                    {filteredAndSortedBlogs.map((blog) => (
                        <BlogCard
                            key={blog.blogId}
                            blog={blog}
                            currentUser={currentUser || JSON.parse(localStorage.getItem('currentArtist'))}
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
                            artistsMap={artistsMap}
                            onTagClick={(tag) => {
                                if (!selectedTagIds.includes(tag.tagId)) {
                                    setSelectedTagIds([...selectedTagIds, tag.tagId]);
                                }
                            }}
                            selectedTagIds={selectedTagIds}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-blogs-container">
                    <span className="no-blogs-icon"><FileQuestion size={48} /></span>
                    <h3 className="no-blogs-title">
                        {searchQuery || selectedTagIds.length > 0 ? 'No matching blogs found' : 'No blogs yet'}
                    </h3>
                    <p className="no-blogs-text">
                        {searchQuery || selectedTagIds.length > 0 ? 'Try adjusting your filters.' : 'Share your imagination and inspire the Hiveminds community!'}
                    </p>
                    {JSON.parse(localStorage.getItem('currentArtist'))?.artistId === artist?.artistId && !searchQuery && selectedTagIds.length === 0 && (
                        <button
                            onClick={() => onNavigate && onNavigate('upload-blog')}
                            className="button-hexagon"
                        >
                            Upload your blog
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default ArtistBlogs;
