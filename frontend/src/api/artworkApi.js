const BASE_URL = "http://localhost:8080/artworks";

export async function getAllArtworks() {
    const res = await fetch(`${BASE_URL}/getAllArtworks`);
    return res.json();
}

export async function insertArtwork(artwork) {
    const res = await fetch(`${BASE_URL}/insertArtwork`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artwork),
    });
    return res.json();
}

// TODO: Add getArtworksByArtistId when backend supports it
// For now we might have to filter on frontend if backend doesn't support filtering
