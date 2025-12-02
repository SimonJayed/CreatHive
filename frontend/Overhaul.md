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
    *   **Fixes**: Changed `likeCount` in `BlogEntity` to `Integer` to handle potential null values and prevent backend crashes.

### Bug Fixes (2025-12-03)
*   **Backend Crash**: Fixed `BlogService.getAllBlogs` crash by ensuring `BlogEntity.likeCount` can handle nulls (changed `int` to `Integer`).
*   **Backend Bug**: Fixed `NullPointerException` in `BlogService.likeBlog` by handling null `likeCount` before incrementing.
*   **Database**: Created and subsequently deleted `reset_db.sql` after resetting the database schema and dropping `blog_favorites`.
*   **Cascade Delete**: Implemented cascade delete for `Artwork` -> `ArtworkTag` by adding `@OneToMany(cascade = CascadeType.ALL)` in `ArtworkEntity` and `@ManyToOne` in `ArtworkTagEntity`.
*   **Frontend API**: Added error handling to `blogApi.js` to prevent unhandled promise rejections.
*   **Sorting**: Fixed `ArtistBlogs.jsx` to correctly apply sorting by date (newest first).
*   **Profile**: Removed `ProfileStats` (XP/Level) from `Profile.jsx`.

### Technical Debt / Future Improvements
*   **N+1 Problem**: Currently, the frontend fetches all blogs, all links, and potentially all artists to join the data. This should be optimized on the backend by creating a DTO that includes author information in the `getAllBlogs` response.
*   **Pagination**: The feed currently loads all blogs. Pagination should be implemented for scalability.

### Feature Updates (2025-12-03)
- **Category Removal**:
    - Removed `category` field from `ArtworkEntity` and `UploadArtwork.jsx`.
- **Blog Likes**:
    - Implemented toggle-like functionality for blogs.
    - Added `BlogLikesEntity` and updated `BlogService`.
- **Artwork Interactions**:
    - Added `likeCount` to `ArtworkEntity`.
    - Created `ArtworkLikesEntity` and `ArtworkFavoritesEntity`.
    - Implemented like and favorite toggle functionality.
- **Profile Favorites**:
    - Added a "Favorites" tab to the user profile.
    - Created `FavoriteArtworks.jsx` to display favorited artworks.
- **Renamed Upload Artwork to Artworks**:
    - Renamed "Upload Artwork" navigation item to "Artworks".
    - Created `ArtworksFeed.jsx` to display a feed of community artworks.
    - Added "Upload Artwork" button within the `ArtworksFeed` page.
    - Implemented `getAllUserArtworks` in `userArtworkApi.js` to map artists to artworks.
    - Fixed duplicate import and data fetching logic in `ArtworksFeed.jsx`.
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
    *   **Fixes**: Changed `likeCount` in `BlogEntity` to `Integer` to handle potential null values and prevent backend crashes.

### Bug Fixes (2025-12-03)
*   **Backend Crash**: Fixed `BlogService.getAllBlogs` crash by ensuring `BlogEntity.likeCount` can handle nulls (changed `int` to `Integer`).
*   **Backend Bug**: Fixed `NullPointerException` in `BlogService.likeBlog` by handling null `likeCount` before incrementing.
*   **Database**: Created and subsequently deleted `reset_db.sql` after resetting the database schema and dropping `blog_favorites`.
*   **Cascade Delete**: Implemented cascade delete for `Artwork` -> `ArtworkTag` by adding `@OneToMany(cascade = CascadeType.ALL)` in `ArtworkEntity` and `@ManyToOne` in `ArtworkTagEntity`.
*   **Frontend API**: Added error handling to `blogApi.js` to prevent unhandled promise rejections.
*   **Sorting**: Fixed `ArtistBlogs.jsx` to correctly apply sorting by date (newest first).
*   **Profile**: Removed `ProfileStats` (XP/Level) from `Profile.jsx`.

### Technical Debt / Future Improvements
*   **N+1 Problem**: Currently, the frontend fetches all blogs, all links, and potentially all artists to join the data. This should be optimized on the backend by creating a DTO that includes author information in the `getAllBlogs` response.
*   **Pagination**: The feed currently loads all blogs. Pagination should be implemented for scalability.

### Feature Updates (2025-12-03)
- **Category Removal**:
    - Removed `category` field from `ArtworkEntity` and `UploadArtwork.jsx`.
- **Blog Likes**:
    - Implemented toggle-like functionality for blogs.
    - Added `BlogLikesEntity` and updated `BlogService`.
- **Artwork Interactions**:
    - Added `likeCount` to `ArtworkEntity`.
    - Created `ArtworkLikesEntity` and `ArtworkFavoritesEntity`.
    - Implemented like and favorite toggle functionality.
- **Profile Favorites**:
    - Added a "Favorites" tab to the user profile.
    - Created `FavoriteArtworks.jsx` to display favorited artworks.
- **Renamed Upload Artwork to Artworks**:
    - Renamed "Upload Artwork" navigation item to "Artworks".
    - Created `ArtworksFeed.jsx` to display a feed of community artworks.
    - Added "Upload Artwork" button within the `ArtworksFeed` page.
    - Implemented `getAllUserArtworks` in `userArtworkApi.js` to map artists to artworks.
    - Fixed duplicate import and data fetching logic in `ArtworksFeed.jsx`.
    - Removed incorrect CSS import in `ArtworksFeed.jsx` to fix "Module not found" error.
    - Implemented Pinterest-style masonry layout in `ArtworksFeed.jsx` and `ArtistArtworks.jsx`.
    - Re-introduced `BlogLikesEntity` and `ArtworkLikesEntity` to enforce "once per user" like rule, as per user request.
    - Created reusable `ArtworkCard.jsx` component for consistent artwork display and interactions (Like, Comment, Share, Favorite).
    - Created `FavoriteArtworks.jsx` to display user's favorited artworks.
    - Fixed CORS issue in `UserArtworkController` to resolve data fetching errors.
    - Updated `Styles.md` with button text color rules and universal icon definitions.
    - Switched `ArtworkService` to use `FavoritesEntity` (legacy) instead of `ArtworkFavoritesEntity` as per user request.
    - Deleted obsolete `ArtworkFavoritesEntity` and `ArtworkFavoritesRepository`.
    - **Iconography**:
        - Installed `react-icons` library.
        - Updated `Styles.md` to define standard icons (FontAwesome).
        - Replaced emojis with customizable SVG icons in `ArtworkCard`, `BlogsFeed`, and `ArtistBlogs`.
    - **UI Improvements**:
        - Updated Sort Filter in `ArtworksFeed` and `BlogsFeed`:
            - Moved filter underneath the page title.
            - Added `FaSortAmountDown` icon.
            - Styled for a cleaner, minimal look.
    - **Sidebar Redesign**:
        -   Implemented vertical sidebar with black background and `#FFB800` icons/text.
        -   Used `react-icons` for all navigation items.
    -   **Enhanced Comments**:
        -   Comments now display the user's name and profile picture.
        -   Added date/time timestamps to comments.
    -   **General UI Polish**:
        -   Added date/time display to `ArtworkCard` and `BlogsFeed`.
        -   Fixed button colors and filter text colors to match primary theme.
    -   **Layout Alignment**:
        -   Fixed sidebar overlap issue by adding `margin-left: 250px` to main content wrapper.
        -   Ensured consistent container widths across Feeds and Profile.
        -   Added primary color border (`1px solid #FFB800`) to sidebar right edge.
        -   Fixed sort filter text color to `#FFB800` for visibility on dark background.
        -   Updated date format in `BlogsFeed` and `ArtistBlogs` to exclude seconds for a cleaner display.
        -   Updated comment date format in `BlogsFeed` and `ArtistBlogs` to exclude seconds.
        -   Added "Time Formatting" rule to `System.md` to enforce no-seconds display.
        -   Fixed `UploadArtwork` image preview to fill the entire upload area (`object-fit: cover`).
        -   Fixed `ArtworkCard` favorite button not toggling visually (implemented `isFavorited` prop).
        -   Fixed `ArtworkCard` comment button not being clickable (added `onComment` handler).
        -   Implemented like and favorite interactions in `ArtistArtworks.jsx` (profile page).
        -   Fixed `FavoriteArtworks.jsx` to correctly display favorited state (`isFavorited={true}`).
