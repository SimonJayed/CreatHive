# System Overhaul & Refactoring Log
# System Overhaul & Refactoring Log

This document tracks significant changes, refactoring efforts, and architectural updates to the CreatHive system.

## 2025-12-03: Blog System Overhaul

### Objective
Transition the "Upload Blog" feature into a comprehensive "Blogs Feed" where users can view blogs from all users, while retaining the ability to upload new blogs.

# System Overhaul & Refactoring Log
# System Overhaul & Refactoring Log

This document tracks significant changes, refactoring efforts, and architectural updates to the CreatHive system.

## 2025-12-03: Blog System Overhaul

### Objective
Transition the "Upload Blog" feature into a comprehensive "Blogs Feed" where users can view blogs from all users, while retaining the ability to upload new blogs.

### Changes Implemented

#### Frontend
1.  **New Component: `BlogsFeed`**
    *   **Purpose**: Displays a feed of all blogs from all users.
    *   **Features**:
        *   **Sorting**: Added a "Sort by" dropdown to `BlogsFeed` to filter blogs by date (Newest/Oldest), defaulting to Newest. Dropdown styled according to `Styles.md`.
    *   **Interactions**: Added Like (Vote) and Comment functionality to `BlogsFeed` and `ArtistBlogs`. **Removed Favorite functionality** as per user request.
    *   **Cleanup**: Removed `xp` and `level` from Profile. Removed `visibility` options from Upload Artwork and Upload Blog forms.
    *   **Fixes**: Fixed date display in blog feeds by handling potential null dates and ensuring correct formatting.

4.  **Backend Changes**
    *   **`BlogEntity`**: Added `likeCount` field.
    *   **`BlogService`**: Added `likeBlog` method. Removed `favoriteBlog`.
    *   **`CommentService`**: Created to handle adding and retrieving comments.
    *   **Cleanup**: Removed `visibility` field from `ArtworkEntity`. Deleted `BlogFavoritesEntity` and `BlogFavoritesRepository`.

### Technical Debt / Future Improvements
*   **N+1 Problem**: Currently, the frontend fetches all blogs, all links, and potentially all artists to join the data. This should be optimized on the backend by creating a DTO that includes author information in the `getAllBlogs` response.
*   **Pagination**: The feed currently loads all blogs. Pagination should be implemented for scalability.
