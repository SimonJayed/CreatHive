const BASE_URL = "http://localhost:8080/userArtwork";

export async function getAllUserArtworks() {
    const res = await fetch(`${BASE_URL}/getAll`);
    return res.json();
}

export async function insertUserArtwork(artworkId, artistId) {
    const res = await fetch(`${BASE_URL}/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId, artistId }),
    });
    return res.json();
}
