Implement the "Hive Theme" across the entire frontend application. This involves a complete visual overhaul using hexagonal shapes, a "Golden Honey" (`#FFB800`) on Black color scheme, and switching to `lucide-react` for iconography.

### Changes Implemented

#### Frontend
1.  **Dependencies**:
    *   Installed `lucide-react`.
    *   (Pending) Uninstall `react-icons` after full migration.

2.  **Global Styles (`index.css`)**:
    *   Updated CSS variables to match `Styles.md` (Hive Theme).
    *   Added hexagonal utility classes: `.button-hexagon`, `.input-hexagon`, `.card-hexagon`, `.icon-hexagon`.
    *   Added honeycomb background pattern.
    *   Added `hexPulse` and `hexSpin` animations.

3.  **Component Updates**:
    *   **Sidebar**: Redesigned with `lucide-react` icons, honeycomb background, and `#FFB800` accents.
    *   **ArtworkCard**: Updated to use `.card-hexagon` and `lucide-react` icons (Hexagon for likes).
    *   **Feeds**: Updated `BlogsFeed` and `ArtworksFeed` to align with the new theme.

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
*   **Backend Bug**: Fixed `ArtworkService` crash by changing `isArchived` to `Boolean` and handling null values in filtering logic to support existing database records.
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
    -   **Delete Functionality**:
        -   Implemented delete functionality for Artworks and Blogs.
        -   Updated `ArtworkService` and `BlogService` to handle cascade deletion of related records (likes, favorites, tags, comments).
        -   Added "Delete" button (trash icon) to `BlogsFeed`, `ArtistBlogs`, and `ArtworkCard` (in Profile).
        -   Ensured delete button is only visible to the content owner.
    -   **Style Refactoring**:
        -   Refactored frontend components to use new design system (CSS variables and utility classes).
        -   Updated Auth, Profile, Artworks, Blogs, Tags, Artists, and Homepage components.
        -   Created new CSS files for components that previously used inline styles.
        -   Fixed lint errors and verified build.
    -   **Artwork Archiving**:
        -   Implemented backend support (`isArchived` field in `ArtworkEntity`).
        -   Added `archiveArtwork` and `getArchivedArtworksByArtistId` to `ArtworkService` and `ArtworkController`.
        -   Updated `ArtworkCard` to include an "Archive" button (visible only to owner).
        -   Updated `Profile` to include an "Archived" tab for viewing archived artworks.
        -   Archived artworks are hidden from public feeds and the main profile view.
    -   **Custom Popups**:
        -   Created `PopupContext` and `usePopup` hook for global popup management.
        -   Created `Popup` component with "Hive Theme" styling (hexagonal buttons, animations).
        -   Replaced all native `alert()` and `confirm()` calls with `showAlert` and `showConfirm`.
        -   Integrated `PopupProvider` into `App.js` (refactored `App` logic into `MainContent`).
        -   Refactored `MainContent.jsx` to use `useAppNavigation` hook to comply with file size limits (~120 lines).
        -   Refactored `BlogCRUD.jsx` by extracting `BlogUploadModal` to comply with file size limits.
    -   **Explore Page Tagging**:
        -   Implemented automatic seeding of default tags (Anime, Abstract, etc.) in `TagService`.
        -   Added `getArtworksByTagId` to backend and frontend.
        -   Updated `Explore.jsx` to fetch tags and filter artworks by selected tag.
    -   **Explore, Tags, and Navigation Enhancements**:
        -   **Backend**:
            -   Created `ArtistInterestEntity` and `ArtistInterestRepository` to track user interests (liked tags).
            -   Updated `TagService` to include `submissionCount` and `isLiked` status in `getAllTags`.
            -   Added `likeTag` and `unlikeTag` endpoints to `TagController`.
        -   **Frontend**:
            -   Updated `Explore.jsx`:
                -   Implemented search for both tags and artworks.
                -   Added "Like" button to tags (heart icon).
                -   Displayed submission counts on tags.
            -   Updated `UploadArtwork.jsx`:
                -   Replaced text input with visual tag chips.
                -   Implemented logic to create new tags or link existing ones.
            -   Updated `ArtworkCard.jsx`:
                -   Added link to artist profile (`/profile/:id`).
            -   Updated `Profile.jsx`:
                -   Added support for viewing other users' profiles via URL parameters.
                -   Added "Interests" section to display liked tags.
            -   Updated `Homepage.jsx` and `useAppNavigation.js`:
                -   Implemented manual routing logic to support `/profile/:id`.

### Bug Fixes (2025-12-05)
*   **Artwork Upload**: Fixed "Failed to link tag to artwork" error.
    *   **Cause**: `UploadArtwork.jsx` was importing `insertArtworkTag` from `artworkApi.js` which used an incorrect endpoint/method signature for the backend.
    *   **Fix**: Switched `UploadArtwork.jsx` to use `insertArtworkTag` from `tagApi.js` which correctly targets `ArtworkTagController`.
    *   **Backend**: Added `@CrossOrigin` to `ArtworkTagController.java` to prevent CORS errors.
    *   **Error Handling**: Added try-catch block in `UploadArtwork.jsx` to gracefully handle tag linking failures without blocking the entire upload process.

### Design Updates (2025-12-05)
*   **Card & Modal Shape**: Removed the hexagonal `clip-path` from `.card-hexagon` and `.modal-content`.
    *   **Reason**: User requested removal of the specific component shape.
    *   **New Style**: Replaced with `border-radius: 12px` for a cleaner, rounded-rectangle look while preserving the "Hive Theme" colors, borders, and hover effects.

*   **Button Standardization**:
    *   **Action**: Applied `.button-hexagon` class to primary buttons in `ProfileHeader`, `SignIn`, `Register`, `UploadArtwork`, `BlogUploadModal`, and `UploadBlog`.
    *   **Result**: "Edit Profile", "Sign In", "Create Account", "Upload Artwork", and "Upload Blog" buttons now use the horizontal hexagon shape (`clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)`) consistent with the "Upload Artwork" button.

*   **Asset Organization**:
    *   **Directory**: Verified/Created `frontend/public/images/tags` for default tag images.
    *   **Usage**: Place default images for tags and backgrounds in `frontend/public/images`.
    *   **Dynamic Fallback**:
        *   **Priority 1**: Default image in `frontend/public/images/tags/{tagname}.jpg`.
        *   **Priority 2**: First submission image for that tag (fetched from backend).
        *   **Priority 3**: Default dark background color.

*   **Artwork Cards**:
    *   **Tags Display**: Updated `ArtworkCard` to display tags below the image.
    *   **Backend Update**: Modified `ArtworkEntity` and `ArtworkService` to populate a transient `displayTags` list for frontend consumption.

*   **Tagging System Fix**:
    *   **Problem**: `ArtworkTagService` was failing to save tags because `@MapsId` relationships (`artwork`, `tag`) were not being set.
    *   **Fix**: Updated `ArtworkTagService` and `ArtworkService` to fetch and set the `ArtworkEntity` and `TagEntity` references before saving `ArtworkTagEntity`.

*   **Bug Fixes**:
    *   **Artwork Display**: Fixed potential NPE in `ArtworkService` by handling null `artworkTags` when populating `displayTags`.
    *   **Profile UI**: Fixed shaking/scrolling issue in "Favorites" tab by adding `break-inside: avoid` to masonry items in `FavoriteArtworks.css`.
    *   **JSON Recursion**: Fixed `HttpMessageNotWritableException` by adding `@JsonIgnore` to `ArtworkTagEntity.artwork`.
    *   **Profile Likes**: Fixed visual toggle bug by ensuring `isLiked` is updated in both frontend state (`ArtistArtworks.jsx`) and backend return value (`ArtworkService.java`).

*   **New Components**:
    *   **FilterSort**: Created a reusable `FilterSort.jsx` component for filtering and sorting content.
    *   **Integration**: Integrated `FilterSort` into `Explore.jsx` (Artworks) and `ArtistBlogs.jsx` (Blogs), enabling multi-tag filtering and sorting by date/likes.
    *   **Design Refinement**: Updated `FilterSort` styles to remove hexagonal shapes and match a minimalist, text-based design per user request.
    *   **Profile Interests**: Styled interests in `Profile.jsx` to match artwork tags and added click-to-navigate functionality (redirects to Explore with tag selected).
    *   **Profile Fixes**:
        *   Fixed "by Unknown" on profile artworks by manually attaching artist data in `Profile.jsx`.
        *   Fixed Favorites tab consistency by lifting state to `Profile.jsx` and passing data via props, eliminating unnecessary re-fetches.
    *   **Interest Persistence**: Updated `InterestPicker.jsx` to automatically "like" the tags corresponding to the selected interests during registration, ensuring they appear in the user's profile.
    *   **Favorites UI**: Removed the star icon from the empty state in `FavoriteArtworks.jsx` per user request.
    *   **Scrollbar Styling**: Implemented a custom "Hive Theme" scrollbar (Gold thumb, Light track) in `index.css` to replace the default browser scrollbar.
    *   **Upload Artwork Fix**: Restored absolute positioning for the image preview in `UploadArtwork.css` to fix the layout regression.
    *   **Like Feature Audit**: Fixed inconsistent "Like" behavior in `ArtistBlogs.jsx` (was using count instead of user-specific boolean) and ensured `isLiked` state updates correctly in `FavoriteArtworks.jsx` and `ArtworksFeed.jsx`.
    *   **Bug Fix**: Resolved a variable redeclaration error in `ArtworksFeed.jsx` that was introduced during the Like feature audit.
    *   **Settings Page**: Created `Settings.css` and refactored `Settings.jsx` to remove inline styles and fix the "Module not found" error.
    *   **Restored Missing File**: Recreated `ArtistBlogs.css` which was missing, ensuring it aligns with the `System.md` design tokens and Hive Theme.
    *   **Documentation Upgrade**: Updated `System.md` with specific sections defining the mandatory file organization structure (CSS in `styles/`, Components in `components/`, etc.) to prevent future regressions.
    *   **Default Assets**: Implemented `images/profile/default_profile.png` as the standard fallback for user avatars across `ProfileHeader.jsx`, `ArtistBlogs.jsx`, and `BlogsFeed.jsx`.

### System Scan & Compliance (2025-12-05)
*   **Objective**: Verify alignment with `System.md` and `Styles.md`.
*   **Findings & Fixes**:
    *   **Inline Styles**: Identified and removed inline styles from `Profile.jsx` and `UploadArtwork.jsx`, moving them to their respective CSS files (`Profile.css`, `UploadArtwork.css`).
    *   **File Sizes**: Noted that `Profile.jsx` and `UploadArtwork.jsx` exceed the recommended 120-line limit. This is marked as technical debt for future refactoring.
    *   **Entity Alignment**: Verified that frontend components (`Profile`, `UploadArtwork`) correctly interact with backend entities (`Artist`, `Artwork`, `Tag`) as per the Data Model.
    *   **Theme Compliance**: Confirmed that the "Hive Theme" (hexagonal buttons, colors, fonts) is consistently applied across the audited components.
