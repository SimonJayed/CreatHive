# System Documentation

**IMPORTANT**: All code changes must follow both `System.md` AND `Styles.md` guidelines.

## Data Model
**Artists are the Users in this application.**
-   **Artist Entity = User Entity**: In CreatHive, the `ArtistEntity` represents the user accounts. Every user who signs up is an artist.
-   **Database Table**: The artist data is stored in the `artist` table (previously `tbl_artist`).
-   **Artist Properties**: Artists have properties like `username`, `email`, `password`, `bio`, `level`, `xp`, etc.
-   **Authentication**: User login and registration are performed using the Artist entity.
-   **Profile Data**: When passing user data to components (e.g., Profile page), the data comes from the Artist entity. Props like `userData` or `artistData` refer to the logged-in artist's information.

## Entity Relationships & Usage Guide
The application uses a **Many-to-Many** relationship model implemented via **Associative Entities**. This allows for greater flexibility and metadata on relationships (e.g., `dateFavorited`, `dateAssigned`).

### Core Entities
-   **Artist**: Represents the user.
-   **Artwork**: Represents an uploaded image/creation.
-   **Blog**: Represents a text post.
-   **Comment**: Represents a comment (content only).
-   **Tag**: Represents a category/tag.

### Associative Entities (The "Link" Tables)
Instead of direct Foreign Keys (e.g., `artist_id` in `Artwork` table), we use separate tables to link entities.

1.  **UserArtwork (`user_artwork`)**: Links **Artist** and **Artwork**.
    -   **Purpose**: Indicates ownership (Who uploaded this artwork?).
    -   **Key**: Composite Key (`artworkId`, `artistId`).
    -   **Usage**: To find an artist's artworks, query `UserArtworkRepository` for all records with the given `artistId`, then fetch the corresponding `Artwork` records.

2.  **UserBlog (`user_blog`)**: Links **Artist** and **Blog**.
    -   **Purpose**: Indicates ownership (Who wrote this blog?).
    -   **Key**: Composite Key (`blogId`, `userId` [which is artistId]).

3.  **Favorites (`favorites`)**: Links **Artist** and **Artwork**.
### API Usage for Uploads
When creating a new resource (Artwork/Blog), you must:
1.  **Insert the Resource**: POST to `/insert...` with the entity body.
2.  **Provide the Owner**: Pass `artistId` as a query parameter (e.g., `?artistId=123`).
3.  **Backend Logic**: The service will save the entity *and* automatically create the corresponding Associative Entity record (e.g., `UserArtwork`) to link it to the artist.

## Workflow Steps
1.  **Exploration**:
    -   Analyzed the `lugatimang3` directory for Backend structure (Spring Boot).
    -   Analyzed the `frontend` directory for Frontend structure (React).
2.  **Pattern Analysis**:
    -   Checked `src/api/blogApi.js` to understand how the frontend communicates with the backend.
    -   Checked `src/components/blogs/BlogCRUD.jsx` and `src/components/blogs/BlogsFeed.jsx` to understand the UI structure, state management, and styling.
3.  **Implementation**:
    -   **Backend**: Created Entity, Repository, Service, and Controller for the `Artist` feature.
    -   **Frontend**: Created API connector and CRUD component for the `Artist` feature, replicating the observed patterns.
4.  **Development Guidelines**:
    -   **Minimize File Creation**: Avoid creating new files whenever possible. Stick to modifying existing files to keep the project structure clean and manageable.
    -   **Responsive Design & Scaling**: Ensure all frontend components are responsive and adapt well to different screen sizes. The UI should scale properly across different resolutions (e.g., 1080p, 1440p, 4K) without breaking layout or readability.
        -   **Zoom In**: Use `flex-wrap`, relative units, and media queries to handle small screens/magnification.
        -   **Zoom Out**: Use `max-width` constraints and centering to handle large screens/high resolution.
        -   **Reference**: Follow the procedures documented in `frontend/Tuts.md`.
    -   **Full-Screen Layout**: All pages should fit within the viewport when fullscreen (no scrolling required). Use `height: 100vh` and overflow management to achieve this. For multi-section pages like Homepage, use CSS scroll-snap to create full-screen sections that snap when scrolling.

## Directory Structure & Patterns

### Frontend (`frontend`)
-   **`src/api/`**:
    -   **Purpose**: Contains API connector functions that handle HTTP requests to the backend.
    -   **Pattern**: Each feature (e.g., Blog, Tag, Artist) has its own file (e.g., `artistApi.js`) exporting async functions like `getAll...`, `insert...`, `update...`, `delete...`.
-   **`src/components/`**:
    -   **Purpose**: Contains the React components responsible for the UI and logic of specific features.
    -   **Pattern**: Grouped by feature (e.g., `artists/ArtistCRUD.jsx`). These components handle fetching data using the API functions, managing local state (forms, lists), and rendering the UI.

### Backend (`lugatimang3`)
-   **`entity/`**: Defines the data model (Database tables).
-   **`repository/`**: Handles database interactions (JPA).
-   **`service/`**: Contains business logic.
-   **`controller/`**: Exposes REST API endpoints.

## Routing
**Routing is essential.**
To fully integrate the new components, they must be added to the application's routing configuration (typically `App.js` or a dedicated router file). This ensures users can navigate to the new pages (e.g., `/artists`).

## File Organization & Structure
**Strict adherence to folder structure is mandatory.**
1.  **CSS/Styles**:
    *   **Location**: All CSS files MUST be placed in `frontend/src/styles/`.
    *   **Rule**: Do NOT co-locate CSS files with components in `src/components/`.
    *   **Importing**: Import styles relative to the component, e.g., `import '../../styles/MyComponent.css';`.

2.  **Components**:
    *   **Location**: React components MUST be placed in `frontend/src/components/`.
    *   **Grouping**: Group related components into subfolders (e.g., `components/profile/`, `components/artworks/`).
    *   **Common Components**: Reusable UI elements (buttons, modals) go in `components/common/`.

3.  **API/Services**:
    *   **Frontend**: All API connector files go in `frontend/src/api/`.
    *   **Backend**: Follow standard Spring Boot layers (`entity`, `repository`, `service`, `controller`).

4.  **Assets**:
    *   **Images**: Static images go in `frontend/public/images/`.

## Quality Control
**Double-checking modified files for errors is a MUST.**
    *   Extract common UI patterns into reusable components (e.g., `EditableText`).

2.  **CSS Management**:
    *   **No Inline Styles**: Move all inline styles to dedicated CSS files in `src/styles/`.
    *   **Class Naming**: Use clean, descriptive, hyphenated class names (e.g., `.profile-header`, `.hero-section`).

3.  **Component Structure**:
    *   **Size Limit**: Keep the main component file under ~120 lines.
    *   **Focus**: The main component should handle state, data fetching, and high-level layout. Subcomponents should handle rendering.
    *   **State Initialization**: Simplify state initialization by merging defaults with props in a single object where possible.

4.  **Process**:
    *   Identify logical sections (Header, Sidebar, Content).
    *   Create subcomponents for each section.
    *   Extract styles to a `.css` file.
    *   Replace inline styles with `className`.
    *   Verify functionality remains identical.
    *   **Verification**: Always check if users' artworks and blogs are showing up properly where they should be (Profile, Blogs Feed, and Artwork pages).

## Iconography
**Library**: `lucide-react`
-   **Standard**: Use `lucide-react` for all icons to ensure a consistent, modern line-style aesthetic.
-   **Usage**: Import specific icons (e.g., `Hexagon`, `MessageCircle`) and use them as components.
-   **Styling**: Icons are SVGs and can be styled with CSS (color, size, stroke width).
-   **Theme**: Use `Hexagon` for likes/favorites and logos to match the Hive Theme.

## Time Formatting
-   **No Seconds**: When displaying time (e.g., in blogs, comments, or artworks), **never include seconds**. Use a format like `Dec 3, 2025, 06:15 PM`.
    -   Use `hour: '2-digit', minute: '2-digit'` in `toLocaleString` options.
    -   Omit `second` property.

## Documentation Updates
**When adding to System.md, update BOTH locations:**
1. The artifact System.md in `.gemini/antigravity/brain/[session-id]/System.md`
2. The project System.md in `frontend/System.md`

**Overhaul Log:**
*   **ALWAYS** update `frontend/Overhaul.md`. This is the primary log for the project. Do not update the one in the root directory.

This ensures consistency across documentation.

## Authentication & Session Management
**Token-based authentication is required for secure user sessions.**
-   **Tokens/Sessions**: The application uses token-based authentication (e.g., JWT) to manage user sessions. Tokens should be stored securely (e.g., in `localStorage` or `sessionStorage`).
-   **Session Persistence**: User sessions must persist across page refreshes. The user should remain logged in until they explicitly log out.
-   **Token Clearing on Logout**: **CRITICAL**: Authentication tokens and session data must ONLY be cleared when the user explicitly clicks the "Logout" button. They should NOT be cleared on page refresh or browser restart (unless session expires). When a user logs out:
    -   Removing tokens from `localStorage` or `sessionStorage`
    -   Clearing any user-related state in the application
    -   Redirecting to the login page
-   **Protected Routes**: Routes that require authentication should verify the presence and validity of tokens before granting access.
## Functional Requirements & Status

### Objective 1: User Registration & Profile Management
**Goal**: Allow users to register and create personalized profiles.
-   **Module 1: User Registration**
    -   Transaction 1: System validates user information during registration. **[Implemented]**
    -   Transaction 2: System restricts access for unregistered users. **[Implemented]**
    -   Transaction 3: Students can choose their interests. **[Implemented]**
    -   Transaction 4: Students can register to the application. **[Implemented]**
-   **Module 2: Profile Management**
    -   Transaction 1: Students can upload a profile picture and biography. **[Implemented]**
    -   Transaction 2: Students can create and edit their personal profiles. **[Implemented]**

### Objective 2: Artwork Upload & Tagging
**Goal**: Provide a system for uploading OCs and artworks with tagging.
-   **Module 1: Artwork Upload**
    -   Transaction 1: Students can upload original characters (OCs) and artworks. **[Implemented]**
    -   Transaction 2: System supports different file formats (e.g., JPG, PNG). **[Implemented]**
    -   Transaction 3: Students can remove/delete a post. **[Implemented]**
    -   Transaction 4: Students can archive/un-list a post. **[Implemented]**
-   **Module 2: Tagging and Categorization**
    -   Transaction 1: System allows searching and filtering based on tags. **[Partially Implemented]** (UI exists in `Explore.jsx`, but logic is static/missing)
    -   Transaction 2: Students can assign tags to their uploads. **[Implemented]**
    -   Transaction 3: Students can search using tags. **[Partially Implemented]**

### Objective 3: Forums & Discussions
**Goal**: Allow users to participate and engage in forums.
-   **Module 1: Forum & Thread Management**
    -   Transaction 1: Users can view discussion forums categorized by topics. **[Implemented]** (via Blogs)
    -   Transaction 2: Users can create new threads and post replies. **[Implemented]** (Blogs & Comments)
    -   Transaction 3: Users can edit or delete their own posts within a limited time. **[Implemented]** (Backend endpoints exist)
-   **Module 2: Moderation & Reporting**
    -   Transaction 1: Users can report inappropriate content. **[Not Started]**
    -   Transaction 2: Moderators can review reports and take action. **[Not Started]**
    -   Transaction 3: Admins can assign moderator roles. **[Not Started]**

### Objective 4: AI-Assisted Discovery
**Goal**: Provide AI-assisted discovery and personalized assistance.
-   **Module 1: AI-Powered Recommendation**
    -   Transaction 1: System recommends artworks/artists based on interests. **[Not Started]**
    -   Transaction 2: System personalizes suggestions for new artworks. **[Not Started]**
-   **Module 2: Auto-Tagging & Description**
    -   Transaction 1: AI suggests relevant tags and descriptions. **[Not Started]**
    -   Transaction 2: AI suggests suitable categories/collections. **[Not Started]**

### Objective 5: Creative Development
**Goal**: Support student creatives in developing and sharing art.
-   **Module 1: Creative Challenges**
    -   Transaction 1: Students can participate in challenges (streaks). **[Not Started]**
    -   Transaction 2: Students can access tutorials and resources. **[Not Started]**
-   **Module 2: Community Gallery**
    -   Transaction 1: Students can post to public gallery. **[Implemented]**
    -   Transaction 2: Students can browse, like, comment, and share. **[Partially Implemented]** (Browse/Like/Comment done, Share pending)

### Objective 6: Resources & Learning
**Goal**: Provide access to art resources and learning materials.
-   **Module 1: Interactive Learning**
    -   Transaction 1: Students can pause/rewind video lessons and take notes. **[Not Started]**
    -   Transaction 2: Students can access downloadable practice sheets. **[Not Started]**
-   **Module 2: Personalized Dashboard**
    -   Transaction 1: Students can track progress and receive certificates. **[Not Started]**
    -   Transaction 2: Students can set learning goals and receive reminders. **[Not Started]**
