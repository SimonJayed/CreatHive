const BASE_URL = "http://localhost:8080/artworks";

export async function getAllArtworks() {
    const res = await fetch(`${BASE_URL}/getAllArtworks`);
    return res.json();
}

export async function getArtworksByArtistId(artistId) {
    const res = await fetch(`${BASE_URL}/getArtworksByArtistId/${artistId}`);
    if (!res.ok) return [];
    return res.json();
}

export async function insertArtwork(artwork, artistId) {
    const res = await fetch(`${BASE_URL}/insertArtwork?artistId=${artistId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artwork),
    });
    return res.json();
}

export async function deleteArtwork(artworkId) {
    const res = await fetch(`${BASE_URL}/deleteArtwork/${artworkId}`, {
        method: 'DELETE',
    });
    return res.text();
}

export async function likeArtwork(artworkId, userId) {
    const res = await fetch(`${BASE_URL}/likeArtwork/${artworkId}/${userId}`, {
        method: 'PUT',
    });
    return res.json();
}

export async function favoriteArtwork(artworkId, userId) {
    const res = await fetch(`${BASE_URL}/favoriteArtwork/${artworkId}/${userId}`, {
        method: 'PUT',
    });
    if (!res.ok) throw new Error("Failed to toggle favorite");
}

export async function getFavoriteArtworks(userId) {
    const res = await fetch(`${BASE_URL}/getFavoriteArtworks/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch favorite artworks");
    return res.json();
}
