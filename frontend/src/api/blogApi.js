const BASE_URL = "http://localhost:8080/blogs";

export async function getAllBlogs() {
  const res = await fetch(`${BASE_URL}/getAllBlogs`);
  return res.json();
}

export async function getBlogsByArtistId(artistId) {
  const res = await fetch(`${BASE_URL}/getBlogsByArtistId/${artistId}`);
  if (!res.ok) return [];
  return res.json();
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
