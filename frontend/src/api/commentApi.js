const BASE_URL = "http://localhost:8080";

// Comment Entity
export async function getAllComments() {
    const res = await fetch(`${BASE_URL}/comment/getAll`);
    return res.json();
}

export async function insertComment(comment) {
    const res = await fetch(`${BASE_URL}/comment/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
    });
    return res.json();
}

export async function updateComment(commentId, comment) {
    const res = await fetch(`${BASE_URL}/comment/update/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
    });
    return res.json();
}

export async function deleteComment(commentId) {
    const res = await fetch(`${BASE_URL}/comment/delete/${commentId}`, {
        method: "DELETE",
    });
    return res.text();
}

// Comment On Artwork Association
export async function getAllCommentsOnArtwork() {
    const res = await fetch(`${BASE_URL}/commentOnArtwork/getAll`);
    return res.json();
}

export async function insertCommentOnArtwork(commentId, artworkId) {
    const res = await fetch(`${BASE_URL}/commentOnArtwork/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, artworkId }),
    });
    return res.json();
}

// Comment On Blog Association
export async function getAllCommentsOnBlog() {
    const res = await fetch(`${BASE_URL}/commentOnBlog/getAll`);
    return res.json();
}

export async function insertCommentOnBlog(commentId, blogId) {
    const res = await fetch(`${BASE_URL}/commentOnBlog/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, blogId }),
    });
    return res.json();
}

// User Comment Association
export async function getAllUserComments() {
    const res = await fetch(`${BASE_URL}/userComment/getAll`);
    return res.json();
}

export async function insertUserComment(artistId, commentId) {
    const res = await fetch(`${BASE_URL}/userComment/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistId, commentId }),
    });
    return res.json();
}
