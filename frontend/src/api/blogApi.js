const BASE_URL = "http://localhost:8080/blogs";

export async function getAllBlogs() {
  try {
    const res = await fetch(`${BASE_URL}/getAllBlogs`);
    if (!res.ok) throw new Error("Failed to fetch blogs");
    return await res.json();
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    return [];
  }
}

export async function getBlogsByArtistId(artistId) {
  try {
    const res = await fetch(`${BASE_URL}/getBlogsByArtistId/${artistId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Error fetching blogs for artist ${artistId}:`, error);
    return [];
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

export async function deleteBlog(blogId) {
  const res = await fetch(`${BASE_URL}/deleteBlog/${blogId}`, {
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
