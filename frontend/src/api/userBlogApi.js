const BASE_URL = "http://localhost:8080/userBlog";

export async function getAllUserBlogs() {
    const res = await fetch(`${BASE_URL}/getAll`);
    if (!res.ok) return [];
    return res.json();
}
