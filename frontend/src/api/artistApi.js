const BASE_URL = "http://localhost:8080/artists";

export async function getAllArtists() {
  const res = await fetch(`${BASE_URL}/getAllArtists`);
  return res.json();
}

export async function getArtistById(artistId) {
  const res = await fetch(`${BASE_URL}/getArtistById/${artistId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function insertArtist(artist) {
  const res = await fetch(`${BASE_URL}/insertArtist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(artist),
  });
  return res.json();
}

export async function updateArtist(artistId, artist) {
  const res = await fetch(`${BASE_URL}/updateArtist?artistId=${artistId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(artist),
  });
  return res.json();
}

export async function deleteArtist(artistId) {
  const res = await fetch(`${BASE_URL}/deleteArtist/${artistId}`, {
    method: "DELETE",
  });
  return res.text();
}

export async function login(credentials) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function register(artist) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(artist),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Registration failed");
  }

  return res.json();
}
