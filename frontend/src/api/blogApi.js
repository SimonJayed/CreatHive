
const BASE_URL = "http://localhost:8080/blogs";

export async function getAllBlogs(userId = 0) {
  try {
    const res = await fetch(`${BASE_URL}/getAllBlogs?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch blogs");
    return await res.json();
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return [];
  }
}

export async function getBlogsByArtistId(artistId, userId = 0) {
  try {
    const res = await fetch(`${BASE_URL}/getBlogsByArtistId/${artistId}?userId=${userId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Error fetching blogs for artist ${artistId}:`, error);
    return [];
  }
}

export async function getBlogById(blogId, userId = 0) {
  try {
    const res = await fetch(`${BASE_URL}/getBlogById/${blogId}?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch blog");
    return await res.json();
  } catch (error) {
    console.error(`Error fetching blog ${blogId}:`, error);
    return null;
  }
}

export async function insertBlog(blog, artistId) {
  const res = await fetch(`${BASE_URL}/insertBlog?artistId=${artistId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  });
  return res.json();
}

export async function updateBlog(blogId, blog) {
  const res = await fetch(`${BASE_URL}/updateBlog?blogId=${blogId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  });
  return res.json();
}

export async function deleteBlog(blogId, artistId) {
  const res = await fetch(`${BASE_URL}/deleteBlog/${blogId}?artistId=${artistId}`, {
    method: "DELETE",
  });
  return res.text();
}

export async function likeBlog(blogId, userId) {
  const res = await fetch(`${BASE_URL}/likeBlog/${blogId}/${userId}`, {
    method: "PUT",
  });
  return res.json();
}

export async function insertBlogTag(blogId, tagId) {
  const res = await fetch(`${BASE_URL}/insertBlogTag?blogId=${blogId}&tagId=${tagId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to link tag to blog");
}

export async function getBlogsByTagId(tagId, userId = 0) {
  const res = await fetch(`${BASE_URL}/getBlogsByTagId/${tagId}?userId=${userId}`);
  return res.json();
}

export async function getRelatedBlogs(blogId, userId = 0) {
  const res = await fetch(`${BASE_URL}/getRelatedBlogs/${blogId}?userId=${userId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getTagsByBlogId(blogId) {
  const res = await fetch(`${BASE_URL}/getTagsByBlogId/${blogId}`);
  return res.json();
}

export async function updateBlogTags(blogId, tagIds) {
  const res = await fetch(`${BASE_URL}/updateBlogTags?blogId=${blogId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tagIds),
  });
  if (!res.ok) throw new Error("Failed to update blog tags");
}
