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
