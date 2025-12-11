# System Overhaul & Refactoring Log

This document tracks significant changes, refactoring efforts, and architectural updates to the CreatHive system.

### Refactoring & UI Fixes
1.  **Reusable `TagSelector`**:
    *   **Generalized Tag Display**: Created `TagList.jsx` as a reusable component for displaying tags (used in `TagSelector`, `BlogsFeed`, etc.) to ensure consistency.
    *   **Multi-Tag Filtering**: Upgraded `BlogsFeed` to support **multi-tag filtering** (AND logic) and displaying tags directly on blog cards.
    *   **Refined Tag Styling**: Applied specific `.blog-card-tags` styling to tags within blog cards to make them **smaller** (10px) than the title, as per user request.
    *   **Profile Picture Persistence**: Updated `BlogsFeed.jsx` to fallback to a **local default avatar** (`/images/profile/default_profile.png`) if the artist has no profile picture, ensuring consistent UI even without user uploads.
    *   **Architecture Mandate**: Updated `System.md` to explicitly require the Profile page to reuse `ArtworkCard` and `BlogCard` components instead of duplicating markup.
    *   **Settings Fix**: Restored missing `handlePasswordReset` function in `Settings.jsx` which caused a crash after refactoring.

## 2025-12-11: System Cleanup and Error Scan

### Objective
Remove unused legacy code and eliminate potential errors.

### Changes Implemented
1.  **Backend (Repository Folder Scan)**:
    -   Verified that the `repository` folder contains no obsolete files. All 13 repositories are actively used by their respective services (`TagService`, `ReportService`, `ChallengeService`, etc.).
    -   **Code Cleanup**: Removed an obsolete comment in `ArtworkService.java` that referenced the deprecated `UserArtworkRepository`.
2.  **Frontend**:
    -   **Legacy API Removal**: Deleted `userBlogApi.js`, `userArtworkApi.js`, `userCommentApi.js`.
    -   **Component Refactor**: Updated `Explore.jsx`, `Challenges.jsx`, `ArtistBlogs.jsx`, `BlogDetails.jsx`, and `ArtworkDetails.jsx` to remove dependencies on these legacy APIs and use direct entity relationships (`blog.author`, `artwork.artist`) instead.
    -   **Code Cleanup**: Removed residual debug `console.log` statements from production code.

## 2025-12-11: Fix Report Modal Z-Index Issue

### Objective
Resolve the issue where the Custom Popup (e.g., "Required reason" alert) was appearing behind the Report Modal.

### Changes Implemented
1.  **CSS Fix**:
    -   **Popup.css**: Increased `z-index` of `.popup-overlay` from `2000` to `3000` to ensure it always stacks on top of `ReportModal` (which has `z-index: 2000` and is portaled to the body).

## 2025-12-11: Refine Blog Details Page

### Objective
Enhance `BlogDetails.jsx` to match the visual structure of `ArtworkDetails.jsx` for consistency, including shareable links and standardized administration actions.

### Changes Implemented
1.  **Layout Refactor**:
    -   **Structure**: Reordered to [Title -> Meta Row (Avatar + Name + Timestamp + Actions) -> Content -> Tags -> Footer Actions].
    -   **Styling**: Updated `BlogDetails.css` to mirror `ArtworkDetails.css`, utilizing standard font sizes (Title: 36px, Content: 18px), spacing, and color tokens.
    -   **Actions Bar**: Adjusted footer actions (Like, Comment, Share, Report) to use `justify-content: space-around` for full-width distribution.
2.  **Navigation**:
    -   verified `/blog/:id` routing exists in `Homepage.jsx`.
    -   Ensured clicking "Share" copies the correct `/blog/123` link.

## 2025-12-11: Implement Details Page Recommendations & Sidebar

### Objective
Update `ArtworkDetails` and `BlogDetails` pages to include a 2-column layout with a "You might also like" sidebar showing related content based on tags.

### Changes Implemented
1.  **New Component**:
    -   **RelatedItems.jsx**: A reusable sidebar component that displays a list of related artworks or blogs. It renders a card for each item with title, author, and image (for artworks).
2.  **Layout Logic**:
    -   **ArtworkDetails.jsx**: Fetched related artworks using `getArtworksByTagId` (based on the first artwork tag). Implemented a 2-column CSS Grid layout (`1fr 300px`) where recommendations sit on the right (desktop) or stack below (mobile).
    -   **BlogDetails.jsx**: Fetched related blogs using `getBlogsByTagId`. Implemented the same 2-column layout logic.
3.  **Styling**:
    -   Updated `ArtworkDetails.css` and `BlogDetails.css` to use `.artwork-content-grid` / `.blog-content-grid` for layout management.
    -   Added responsive media queries to stack columns on screens narrower than 900px.
4.  **Navigation**:
    -   Clicking a recommendation uses `onNavigate` to seamlessly switch to the new item.
    -   Fixed accidental markdown artifacts in `BlogDetails.jsx`.
    -   Fixed import error in `BlogDetails.jsx` by using `addComment` (aliased).
    -   Enhanced `ArtworkDetails` to fetch "More from this artist" and merge with tag-based recommendations.
    -   Updated `RelatedItems` to show a friendly empty state message.
    -   Fixed import error in `BlogDetails.jsx` by using `addComment` (aliased).
    -   Enhanced `ArtworkDetails` to fetch "More from this artist" and merge with tag-based recommendations.
    -   Updated `RelatedItems` to show a friendly empty state message.
    -   Updated `BlogDetails` logic for consistency.
    -   Converted related items to `<a>` tags for better accessibility and "Open in new tab" support.

    -   Converted related items to `<a>` tags for better accessibility and "Open in new tab" support.

## 2025-12-11: Refactor Recommendations to Backend

### Objective
Improve efficiency and reduce frontend complexity by moving recommendation logic (Author + Tag matching) to the backend.

### Changes Implemented
1.  **Backend Logic**:
    -   **ArtworkService / BlogService**: Implemented `getRelatedArtworks` / `getRelatedBlogs`.
    -   **Repositories**: Added querying logic to find items by same artist OR matching tags, excluding current ID.
    -   **Controllers**: Exposed `/getRelatedArtworks/{id}` and `/getRelatedBlogs/{id}` endpoints.
2.  **Frontend Updates**:
    -   **API**: Updated `artworkApi.js` and `blogApi.js` to consume new endpoints.
    -   **Components**: Refactored `ArtworkDetails.jsx` and `BlogDetails.jsx` to replace complex client-side filtering with a single API call.
    -   **Fixes**: Resolved syntax errors (accidental markdown artifacts) in JSX files.

### UI & Navigation Refinement
-   **Button Consistency**: Fixed `ArtworkDetails` and `BlogDetails` Like/Comment buttons to match Share/Report style (removed borders/background) by correcting class name typos.
-   **Blog Recommendations**: Updated `RelatedItems` to hide images when displaying related blogs.
-   **Navigation**: Fixed `Homepage.jsx` to accept numeric IDs for 'artwork' tab navigation. Added `window.scrollTo(0, 0)` in `RelatedItems` for better UX.

### Visual & Readability Improvements
-   **Empty State**: Fixed unreadable "No related items" text by setting a white background in `RelatedItems.css`.
-   **Artwork Recommendations**: Implemented robust image handling in `ArtworkDetails.jsx` to dynamically detect and append data URI prefixes, correcting missing images.
-   **Blog Details Layout**: Rearranged `BlogDetails` to match user preference: Content (no label) -> Tags -> Timestamp (bottom). Removed "Description" label.
-   **Homepage Content**: Updated "Why CreatHive?" section text and feature cards ("Creative Challenges", "Learn & Grow") to match design mockup.
-   **Back Buttons**: Updated `ArtworkDetails` and `BlogDetails` back buttons to use `var(--primary-color)` (yellow/gold) to match page titles.
-   **Blog Card Clickability**: Enhanced `BlogCard` to be fully clickable, improving navigation to details page while preventing accidental clicks on interactive elements.
-   **Report Modal Fix**: Prevented `ReportModal` interactions from triggering parent `BlogCard` click navigation by stopping event propagation.
-   **Archiving Fix**: Refactored `getArchivedArtworksByArtistId` (backend and frontend) to accept `userId`, ensuring `isLiked` and `isFavorited` statuses are correctly populated for archived artworks.
-   **Profile Header**: Updated `ProfileHeader` to display the username (`@username`) and removed the email address display for cleaner profile aesthetics.
-   **Page Title Standardization**: Standardized main page titles (Explore, Blogs, Challenges, Learn, Profile) to `clamp(24px, 4vw, 32px)` for consistency and responsiveness.

## 2025-12-11: System-Wide Alignment & Standardization

### Summary
Executed a system-wide scan for `Styles.md` compliance, specifically targeting inline styles and hardcoded hex values. Refactored key components to enforce the "Hive Theme" and consistent spacing.

### Changes
1.  **BlogDetails Standardization**:
    -   Created `frontend/src/styles/BlogDetails.css` (mirrors `ArtworkDetails.css`).
    -   Refactored `BlogDetails.jsx`: Removed all inline styles, standardized "Back" button, headers, and metadata layout to match `ArtworkDetails`.
2.  **Learn Page Cleanup**:
    -   Refactored `Learn.jsx` to remove inline styles for titles/subtitles.
    -   Updated `Learn.css` with missing standard classes.
3.  **UploadArtwork Cleanup**:
    -   Refactored `UploadArtwork.jsx` to remove inline styles for the "Challenge Alert" box.
    -   Updated `UploadArtwork.css` with `.challenge-alert-box` and `.tag-requirement-note`.
4.  **Sidebar Check**:
    -   Verified `Sidebar.jsx`; `Hexagon` logo uses hardcoded hex as per brand standard exceptions, but structure aligns with `System.md`.

### Verification
-   **Files Checked**: `BlogDetails.jsx`, `ArtworkDetails.jsx`, `Learn.jsx`, `UploadArtwork.jsx`, `Sidebar.jsx`.
-   **CSS**: New classes use variables (`var(--primary-color)`, `var(--text-color)`) instead of hardcoded hexes where possible.

## 2025-12-11: Fix Artwork Deletion (Cascade Logic)

### Objective
Fix the issue where artwork deletion fails due to Foreign Key constraints from Reports, Legacy Data, and related entities.

### Changes
1.  **ArtworkService.java**:
    -   Updated `deleteArtwork` to manually cascade delete:
        1.  **Reports** (via `ReportRepository`).
        2.  **Legacy UserArtwork** (via `ArtworkRepository` native query).
        3.  **Favorites**.
        4.  **ArtworkLikes**.
        5.  **ArtworkTags**.
        6.  **Comments** (including legacy `user_comment` cleanup).
        7.  **Artwork Entity**.
2.  **ArtworkRepository.java**:
    -   Added `deleteLegacyUserArtwork` native query to handle `user_artwork` table cleanup.

## 2025-12-11: Fix Blog Deletion (Legacy FK Constraints)

### Objective
Resolve issue where blogs could not be deleted due to foreign key constraints from legacy tables (`user_blog`, `user_comment`) and associated reports.

### Changes Implemented
1.  **Backend Repositories**:
    -   `BlogRepository`: Added native query `deleteLegacyUserBlog` to remove entries from `user_blog` table.
    -   `CommentRepository`: Added native query `deleteLegacyUserComment` to remove entries from `user_comment` table.
    -   `ReportRepository`: Added `findByReportedItemIdAndItemType` to fetch reports associated with a blog.
2.  **BlogService**:
    -   Updated `deleteBlog` method to perform a cascaded cleanup in the following order:
        1.  Delete associated **Reports**.
        2.  Delete legacy **UserBlog** entry.
        3.  Delete **Comments** (and their legacy `user_comment` entries).
        4.  Delete **BlogLikes**.
        5.  Delete **BlogTags**.
        6.  Delete the **Blog** entity itself.

## 2025-12-11: System Efficiency Refactor (N+1 & Rendering)

### Objective
Optimize backend data fetching and frontend rendering to improve performance and reduce database load.

### Changes Implemented
1.  **Backend (N+1 Query Fixes)**:
    -   **Repositories**: Added `findLikedBlogIdsByUserId`, `findLikedArtworkIdsByUserId`, and `findFavoriteArtworkIdsByUserId` to fetch relationship IDs in batch.
    -   **Services**: Updated `BlogService` and `ArtworkService` to use these batch fetch methods instead of iterating through entities and querying `existsById` for each one. This significantly reduces database round-trips (from O(N) to O(1) for relationship checks).
2.  **Frontend (Rendering Optimization)**:
    -   **BlogsFeed.jsx**: Implemented `useMemo` for sorting and filtering blogs. Removed redundant legacy API calls (`getAllUserBlogs`, `getAllUserComments`).
    -   **ArtistArtworks.jsx**: Implemented `useMemo` for artwork sorting.

## 2025-12-11: Data Migration Fix (Missing Posts)

### Objective
Restore visibility of existing Blogs and Artworks that disappeared from profiles due to the transition from Associative Entities (`UserBlog`, `UserArtwork`) to direct relationships without migrating old data.

### Changes Implemented
1.  **Backend Migration Logic**:
    -   **BlogService & ArtworkService**: Restored `@PostConstruct migrateLegacyData()` method.
    -   **Repositories**: Added `getLegacyArtistId` native query to `BlogRepository` and `ArtworkRepository` to fetch the owner ID from the legacy `user_blog` and `user_artwork` tables.
    -   **Process**: On startup, the system now checks for entities with `NULL` authors/artists and populates them using the legacy relationship data.

## 2025-12-11: System-Wide Architecture Refactor (Efficiency & Stability)

### Objective
Simplify the backend architecture by moving from complex Associative Entities to direct `@ManyToOne` relationships for ownership (Artworks, Blogs, Comments), and standardize transaction management to prevent data corruption.

### Changes Implemented
1.  **Blog API Fix**:
    -   Fixed `deleteBlog` in `blogApi.js` to correctly pass `artistId`.
2.  **Artwork Refactor**:
    -   Modified `ArtworkEntity`: Added direct `@ManyToOne ArtistEntity artist`.
    -   Updated `ArtworkService`:
        -   Added `@PostConstruct` migration to move `UserArtwork` data to `ArtworkEntity.artist`.
        -   Refactored `insertArtwork`, `getArtworksByArtistId`, and `deleteArtwork` to use/set the direct relationship.
        -   Added `@Transactional` to ensure atomic operations.
3.  **Comment Refactor**:
    -   Modified `CommentEntity`: Added direct `@ManyToOne` fields for `author`, `blog`, and `artwork`.
    -   Updated `CommentService`:
        -   Added migration to move `UserComment`, `CommentOnBlog`, and `CommentOnArtwork` data to direct fields.
        -   Refactored `addComment` and `addCommentToArtwork` to set direct relationships.
        -   Refactored getters to use direct repository finders.
        -   Added `@Transactional`.
4.  **UI Refactor**:
    -   Created `CommentSection.jsx`: A shared component for comments.
    -   Updated `BlogCard.jsx` and `ArtworkDetails.jsx` to use `CommentSection`, ensuring consistent UI and fixing "Unknown User" bugs by properly checking `comment.author`.
    -   *Fix*: Removed incorrect import in `CommentSection.jsx` to resolve build error.
    -   *Enhancement*: Adjusted `CommentSection` to display date next to username.

## 2025-12-11: Blog Experience Enhancements
1.  **Blog Details Page**:
    -   Created `BlogDetails.jsx`: Standalone page for sharing/viewing single blogs.
    -   Implemented `getBlogById` in `BlogController` and `BlogService` (Backend) and `blogApi.js` (Frontend).
    -   Updated Routing in `Homepage.jsx` and `useAppNavigation.js` to support `/blog/:id`.
    -   Updated `BlogCard.jsx` to navigate to details page on title click.
    -   *Revert*: Changed blog title color back to default (black) in `BlogCard.jsx` upon user request.
    -   *Cleanup*: Removing obsolete associative entities (`UserBlog`, `UserArtwork`, etc.) and updating services to fix build errors.
5.  **Documentation**:
    -   Updated `System.md` to reflect the shift from Associative Entities to Direct Relationships for ownership.

## 2025-12-11: Blog Architecture Refactor

### Objective
Fix blog deletion issues by removing reliance on the manual associative entity `UserBlog` for ownership validation and deletion.

### Changes Implemented
1.  **Entity Restructuring**:
    -   Modified `BlogEntity` to include a direct `@ManyToOne` relationship to `ArtistEntity` (`author`).
    -   Added `findByAuthor_ArtistId` to `BlogRepository`.
2.  **Service Logic**:
    -   **Migration**: Added `@PostConstruct` migration in `BlogService` to automatically populate the `author` field for existing blogs using `UserBlog` data.
    -   **Insert**: Updated `insertBlog` to set the `author` directly.
    -   **Delete**: Updated `deleteBlog` to verify ownership via `blog.getAuthor()` instead of querying `UserBlogRepository`.
    -   **Get**: Updated `getBlogsByArtistId` to use the direct repository finder.
4.  **Frontend**:
    -   **BlogsFeed.jsx**: Updated to prioritize `blog.author` for artist mapping, falling back to `UserBlog` map only for legacy data where migration might have failed or hasn't run.
5.  **Debugging & Stability**:
    -   **BlogService**: Added `@Transactional` annotation to ensure atomic operations (especially for deletion). Wrapped `deleteBlog` in a try-catch block to return detailed error messages instead of failing silently or with generic errors.
3.  **Documentation**:
    -   Updated `System.md` to reflect that Blogs now use a direct relationship, deviating from the standard associative entity pattern.

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
