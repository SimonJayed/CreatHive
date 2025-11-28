# System Overhaul Documentation
    - `ArtworkTagEntity`: Links Artwork and Tag.

### 2. Repositories
Created `JpaRepository` interfaces for all new entities.

### 3. Services
Created service classes for all new entities to handle business logic and CRUD operations.

### 4. Controllers
Created REST controllers for all new entities.

## Usage Guide

### Creating Relationships
Since direct foreign keys (like `artistId` in `Artwork`) have been removed, creating a relationship now involves two steps:
1.  **Create the Core Entity**: e.g., create an `Artwork` using `/artwork/insert`.
2.  **Create the Association**: e.g., link the `Artwork` to an `Artist` using `/userArtwork/insert`.

### API Endpoints for Associations

| Relationship | Endpoint | Method | Payload |
| :--- | :--- | :--- | :--- |
| **User Creates Artwork** | `/userArtwork/insert` | POST | `{ "artistId": 1, "artworkId": 101 }` |
| **User Authors Blog** | `/userBlog/insert` | POST | `{ "userId": 1, "blogId": 202 }` |
| **User Writes Comment** | `/userComment/insert` | POST | `{ "artistId": 1, "commentId": 303 }` |
| **User Favorites Artwork** | `/favorites/insert` | POST | `{ "artistId": 1, "artworkId": 101 }` |
| **Comment on Artwork** | `/commentOnArtwork/insert` | POST | `{ "commentId": 303, "artworkId": 101 }` |
| **Comment on Blog** | `/commentOnBlog/insert` | POST | `{ "commentId": 303, "blogId": 202 }` |
| **Tag Artwork** | `/artworkTag/insert` | POST | `{ "artworkId": 101, "tagId": 5 }` |

### Retrieving Data
- To get all artworks by an artist, you would now query the `UserArtwork` repository/service (or use the endpoint `/userArtwork/getAll` and filter, though a custom endpoint `getByArtistId` is recommended for production).
- Similarly for other relationships.

## Functional Requirements Gap Analysis
*(As of 2025-11-29)*

### Objective 1: User Registration & Profile Management
- [x] **Registration**: Implemented (Name, Username, Email, Password).
- [x] **Validation**: Implemented (Basic form validation).
- [x] **Access Control**: Implemented (Login required for uploads).
- [x] **Interests**: Implemented (InterestPicker UI), Backend persistence verified.
- [x] **Profile**: Implemented (Pic, Bio, Edit).

### Objective 2: Artwork Upload & Tagging
- [x] **Upload**: Implemented (Image, Title, Desc, Visibility).
- [x] **Formats**: Implemented (JPG, PNG supported via Base64).
- [x] **Delete**: Implemented (API endpoint exists, UI needs verification).
- [ ] **Archive/Un-list**: Partially Implemented (`visibility` field exists: Public/Unlisted/Private).
- [x] **Tagging**: Implemented (Assign tags on upload).
- [ ] **Search/Filter**: Backend `findByTag` exists? Needs verification. Frontend Search UI missing.

### Objective 3: Forums & Discussions
- [x] **Threads**: Implemented via `Blog` entity.
- [x] **Replies**: Implemented via `Comment` entity.
- [ ] **Categorization**: `Blog` has no category field? Needs verification.
- [ ] **Edit/Delete**: `deleteBlog` exists. `editBlog` exists. Time window constraint missing.
- [ ] **Moderation**: Reporting/Moderator roles NOT implemented.

### Objective 4: AI-Assisted Discovery
- [ ] **Recommendations**: NOT implemented.
- [ ] **Auto-Tagging**: NOT implemented.

### Objective 5: Creative Development
- [ ] **Challenges**: NOT implemented.
- [x] **Community Gallery**: Implemented (Homepage feed).
- [x] **Interactions**: Like (Favorites) & Comment implemented. Share NOT implemented.

### Objective 6: Resources & Learning
- [ ] **Learning Modules**: NOT implemented.
- [ ] **Dashboard**: NOT implemented.

### Summary
The Core features (Objectives 1 & 2) are largely complete. The Social features (Objective 3) are partially met by Blogs/Comments. Advanced features (Objectives 4, 5, 6) are currently out of scope/not started.
