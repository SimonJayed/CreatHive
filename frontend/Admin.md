# Admin & Moderator Guide

This document provides instructions for administrative tasks, including managing user roles and asset naming conventions.

## 1. Tag Image Naming Conventions

To ensure default images for tags load correctly in the `Explore` page, you must follow this naming convention:

*   **Path**: `frontend/public/images/tags/`
*   **Format**: `[tagname].jpg`
*   **Case**: All lowercase.

**Examples:**
*   Tag: **Anime** -> Image: `anime.jpg`
*   Tag: **Abstract** -> Image: `abstract.jpg`
*   Tag: **Sci-Fi** -> Image: `sci-fi.jpg` (if space was replaced) *Note: code uses `tag.name.toLowerCase()`, so spaces might break it. Ensure tag names are single words or handle spaces consistent with filename systems.*

If no image is found, the system currently falls back to a broken image or empty state. Ensure all default tags have a corresponding JPG file.

### Default Tags List
The system automatically seeds the following tags. You should provide images for each:

| Tag Name | Expected Image Filename |
| :--- | :--- |
| Anime | `anime.jpg` |
| Abstract | `abstract.jpg` |
| Cartoon Style | `cartoon style.jpg` |
| Chibi Style | `chibi style.jpg` |
| Concept Art | `concept art.jpg` |
| Cubism | `cubism.jpg` |
| Cyberpunk | `cyberpunk.jpg` |
| Dark Art | `dark art.jpg` |
| Academic Art | `academic art.jpg` |
| Expressionism | `expressionism.jpg` |
| Fantasy | `fantasy.jpg` |
| Gothic Art | `gothic art.jpg` |
| Hyperrealism | `hyperrealism.jpg` |
| Impressionism | `impressionism.jpg` |
| Minimalism | `minimalism.jpg` |
| Pop Art | `pop art.jpg` |
| Realism | `realism.jpg` |
| Sci-Fi Art | `sci-fi art.jpg` |
| Surrealism | `surrealism.jpg` |
| Dada Art | `dada art.jpg` |
| Art Nouveau | `art nouveau.jpg` |

---

## 2. Accessing Moderator/Admin Features

The application supports `MODERATOR` and `ADMIN` roles, which unlock the **Moderation** tab in the sidebar.

### How to Promote a User to Moderator/Admin

Currently, role promotion is handled via database updates (SQL). There is no UI for promoting users to prevent unauthorized access.

#### Step-by-Step Tutorial (SQL)

1.  **Access the Database**: Open your database management tool (e.g., MySQL Workbench, DBeaver) or command line interface.
2.  **Find the User**: Identify the user you want to promote.
    ```sql
    SELECT * FROM tbl_artist WHERE username = 'target_username';
    ```
    *(Note: Replace `target_username` with the actual username)*

3.  **Update the Role**: Run the update command to set the role to 'MODERATOR' or 'ADMIN'.
    ```sql
    -- Promote to Moderator
    UPDATE tbl_artist SET role = 'MODERATOR' WHERE username = 'target_username';

    -- Promote to Admin
    UPDATE tbl_artist SET role = 'ADMIN' WHERE username = 'target_username';
    ```

4.  **Verify Access**:
    *   Have the user **Log Out** and **Log In** again.
    *   The **Shield Icon (Moderation)** should now appear in their Sidebar.
    *   Clicking it enables access to the `ModeratorDashboard` to view and manage reports.

### Admin/Moderator Features
*   **Report Management**: View reported Users, Artworks, and Blogs.
*   **Action Reports**: Dismiss reports or take punitive actions (future implementation).
