const BASE_URL = "http://localhost:8080/tags";

export async function getAllTags() {
  const res = await fetch(`${BASE_URL}/getAllTags`);
  return res.json();
}

export async function insertTag(tag) {
  const res = await fetch(`${BASE_URL}/insertTag`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
  });
  return res.json();
}

export async function updateTag(tagId, tag) {
  const res = await fetch(`${BASE_URL}/updateTag?tagId=${tagId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
  });
  return res.json();
}

export async function deleteTag(tagId) {
  const res = await fetch(`${BASE_URL}/deleteTag/${tagId}`, {
    method: "DELETE",
  });
  return res.text();
}
