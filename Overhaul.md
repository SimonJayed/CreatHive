# System Overhaul & Refactoring Log

This document tracks significant changes, refactoring efforts, and architectural updates to the CreatHive system.

### Refactoring & UI Fixes
1.  **Reusable `TagSelector`**:
    *   Created `TagSelector.jsx` and `TagSelector.css` for consistent tag management.
    *   Refactored `UploadArtwork.jsx` and `UploadBlog.jsx` to use this new component.
2.  **UI Improvements**:
    *   Fixed "Create Blog" button alignment in `BlogsFeed.css`.
    *   Standardized tag input styling compliant with `Styles.md`.

### Backend Improvements
1.  **Relationship Audit**:
    *   Updated `BlogEntity` to include `@OneToMany` relationship for `blogTags` with `CascadeType.ALL`.
    *   This ensures proper lifecycle management and orphan removal for blog tags.
2.  **Bug Fixes**:
    *   Resolved `availableTags` reference error in `UploadArtwork.jsx` by restoring state management for tag ID resolution.
3.  **Visual Overhaul (Design Match)**:
    *   **Tag Readability**: Updated `TagSelector.css` to enforce **black text on yellow background**, resolving low-contrast issues on Upload and Profile pages.
    *   **Explore Bar Reuse**: Refactored `BlogsFeed.jsx` to implementation the **Dark Filter Bar** from the Explore page, using the shared `FilterSort` component for consistent filtering and sorting UX.
    *   **Generalized Tag Display**: Created `TagList.jsx` as a reusable component for displaying tags (used in `TagSelector`, `BlogsFeed`, etc.) to ensure consistency.
    *   **Multi-Tag Filtering**: Upgraded `BlogsFeed` to support **multi-tag filtering** (AND logic) and displaying tags directly on blog cards.
    *   **Refined Tag Styling**: Applied specific `.blog-card-tags` styling to tags within blog cards to make them **smaller** (10px) than the title, as per user request.
    *   **Profile Picture Persistence**: Updated `BlogsFeed.jsx` to fallback to a **local default avatar** (`/images/profile/default_profile.png`) if the artist has no profile picture, ensuring consistent UI even without user uploads.
    *   **Architecture Mandate**: Updated `System.md` to explicitly require the Profile page to reuse `ArtworkCard` and `BlogCard` components instead of duplicating markup.
    *   **Settings Fix**: Restored missing `handlePasswordReset` function in `Settings.jsx` which caused a crash after refactoring.

## 2025-12-08: Blog Tagging & Editing Implementation

### Objective
Implement categorization (Tagging) and full editing capabilities for blogs, ensuring they are discoverable and mutable by their authors.

### Changes Implemented

#### Backend
1.  **Tagging Support**:
    *   Created `BlogTagEntity` (Many-to-Many association).
    *   Updated `BlogService` with `insertBlogTag`, `updateBlogTags`, `getBlogsByTagId`, `getTagsByBlogId`.
    *   Fixed `insertBlogTag` to correctly set entity relationships for `@MapsId`.
2.  **Controller Updates**:
    *   Exposed endpoints for tag operations in `BlogController`.

#### Frontend
1.  **Editing UI**:
    *   Updated `UploadBlog.jsx` to support "Edit Mode".
    *   Integrated `getTagsByBlogId` to pre-fill tags.
    *   Adjusted `handleSubmit` to call `updateBlog` and `updateBlogTags`.
2.  **Tag Filtering**:
    *   Updated `BlogsFeed.jsx` to display a filter bar.
    *   Implemented client-side/API-based filtering using `getBlogsByTagId`.

### Fixes
*   Fixed `BlogService.java` corruption issue.
*   Fixed duplicate code in `blogApi.js`.
*   Fixed backend bug where `insertBlogTag` failed to set mapped entities.

## 2025-12-03: Blog System Overhaul

### Objective
Transition the "Upload Blog" feature into a comprehensive "Blogs Feed" where users can view blogs from all users, while retaining the ability to upload new blogs.

### Changes Implemented


### Technical Debt / Future Improvements
*   **N+1 Problem**: Currently, the frontend fetches all blogs, all links, and potentially all artists to join the data. This should be optimized on the backend by creating a DTO that includes author information in the `getAllBlogs` response.
*   **Pagination**: The feed currently loads all blogs. Pagination should be implemented for scalability.
