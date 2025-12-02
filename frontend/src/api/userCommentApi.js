const BASE_URL = "http://localhost:8080/userComment";

export const getAllUserComments = async () => {
    try {
        const response = await fetch(`${BASE_URL}/getAll`);
        if (!response.ok) {
            throw new Error('Failed to fetch user comments');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching user comments:", error);
        throw error;
    }
};
