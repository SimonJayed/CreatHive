const BASE_URL = "http://localhost:8080/comments";

export const addComment = async (blogId, artistId, content) => {
    const response = await fetch(`${BASE_URL}/addComment?blogId=${blogId}&artistId=${artistId}&content=${encodeURIComponent(content)}`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
};

export const getCommentsByBlogId = async (blogId) => {
    const response = await fetch(`${BASE_URL}/getCommentsByBlogId/${blogId}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
};

export const addCommentToArtwork = async (artworkId, artistId, content) => {
    const response = await fetch(`${BASE_URL}/addCommentToArtwork?artworkId=${artworkId}&artistId=${artistId}&content=${encodeURIComponent(content)}`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to add comment to artwork');
    return response.json();
};

export const getCommentsByArtworkId = async (artworkId) => {
    const response = await fetch(`${BASE_URL}/getCommentsByArtworkId/${artworkId}`);
    if (!response.ok) throw new Error('Failed to fetch artwork comments');
    return response.json();
};
