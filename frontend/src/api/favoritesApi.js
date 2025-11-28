const BASE_URL = "http://localhost:8080/favorites";

export async function getAllFavorites() {
    const res = await fetch(`${BASE_URL}/getAll`);
    return res.json();
}

export async function insertFavorite(artworkId, artistId) {
    const res = await fetch(`${BASE_URL}/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId, artistId }),
    });
    return res.json();
}
