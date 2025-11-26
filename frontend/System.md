# System Documentation

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
    -   **Responsive Design**: Ensure all frontend components are responsive and adapt well to different screen sizes. Use flexible layouts (Flexbox/Grid) and media queries where necessary.
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
