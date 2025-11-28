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

// Artwork Tag Association
export async function getAllArtworkTags() {
  const res = await fetch(`http://localhost:8080/artworkTag/getAll`);
  return res.json();
}

export async function insertArtworkTag(artworkId, tagId) {
  const res = await fetch(`http://localhost:8080/artworkTag/insert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ artworkId, tagId }),
  });
  return res.json();
}
