# System Documentation

**IMPORTANT**: All code changes must follow both `System.md` AND `Styles.md` guidelines.

## Data Model
**Artists are the Users in this application.**
-   **Artist Entity = User Entity**: In CreatHive, the `ArtistEntity` represents the user accounts. Every user who signs up is an artist.
-   **Database Table**: The artist data is stored in the `artist` table (previously `tbl_artist`).
-   **Artist Properties**: Artists have properties like `username`, `email`, `password`, `bio`, `level`, `xp`, etc.
-   **Authentication**: User login and registration are performed using the Artist entity.
-   **Profile Data**: When passing user data to components (e.g., Profile page), the data comes from the Artist entity. Props like `userData` or `artistData` refer to the logged-in artist's information.

## Workflow Steps
1.  **Exploration**:
    -   Analyzed the `lugatimang3` directory for Backend structure (Spring Boot).
    -   Analyzed the `frontend` directory for Frontend structure (React).
2.  **Pattern Analysis**:
    -   Checked `src/api/blogApi.js` to understand how the frontend communicates with the backend.
    -   Checked `src/components/blogs/BlogCRUD.jsx` to understand the UI structure, state management, and styling.
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

## Quality Control
**Double-checking modified files for errors is a MUST.**
Before committing any changes, always:
1. Review all modified files for syntax errors
2. Test functionality in the browser
3. Verify that changes follow **BOTH** System.md **AND** Styles.md guidelines
4. **Double-check proper indentation and bracket matching**
5. Ensure no regressions were introduced
6. **Verify backend alignment**: When making frontend API changes, ALWAYS check the corresponding backend files:
   - **Controller**: Verify endpoint paths, HTTP methods, and parameter names match
   - **Entity**: Confirm field names and types align with frontend expectations
   - **Repository**: Check that query methods exist and return expected data types
   - **Service**: Ensure business logic matches frontend assumptions

## Refactoring Standards
To maintain code quality and readability, follow these guidelines when refactoring components:

1.  **Component Decomposition**:
    *   Break large components into smaller, focused subcomponents (e.g., `ProfileHeader`, `ProfileBio`).
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

## Documentation Updates
**When adding to System.md, update BOTH locations:**
1. The artifact System.md in `.gemini/antigravity/brain/[session-id]/System.md`
2. The project System.md in `frontend/System.md`

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
-   **Token Refresh**: Implement token refresh mechanisms to maintain user sessions without requiring frequent re-authentication.
