# Responsive Design & Zoom Handling Tutorial

This guide documents the process of ensuring the application handles both "zooming in" (small screens/magnification) and "zooming out" (large screens/high resolution) gracefully.

## 1. The Problem
- **Zooming In**: Elements overlap, text gets cut off, or horizontal scrolling appears.
- **Zooming Out**: Content stretches infinitely, becoming unreadable or looking broken on wide screens.

## 2. The Solution Strategy

### A. Handling Zoom In (Small Screens)
1.  **Use Flexible Units**: Avoid fixed `px` widths for containers. Use `%` or `flex: 1`.
2.  **Flex Wrap**: Always use `flex-wrap: wrap` on flex containers. This allows items to stack vertically when horizontal space runs out.
3.  **Clamp for Fonts**: Use `font-size: clamp(min, preferred, max)` to ensure text scales with the viewport but stays within readable limits.
    *   *Example*: `font-size: clamp(20px, 4vw, 28px);`
4.  **Media Queries**: Add breakpoints (e.g., `@media (max-width: 768px)`) to stack layouts vertically on mobile.

### B. Handling Zoom Out (Large Screens)
1.  **Max-Width Constraints**: Add `max-width` to content containers to prevent them from stretching too wide.
    *   *Example*: `max-width: 1200px;`
2.  **Centering**: Use `margin: 0 auto` or `justify-content: center` (in flexbox) to keep the constrained content centered in the viewport.
3.  **Container Alignment**: Ensure the main wrapper aligns items to the center (`align-items: center`) so the content doesn't stick to the left edge on ultra-wide screens.

## 3. Implementation Example

### CSS Pattern
```css
.container {
    display: flex;
    flex-direction: column;
    align-items: center; /* Center content on zoom out */
    padding: 20px;
}

.content-card {
    width: 100%; /* Fill available space on small screens */
    max-width: 1200px; /* Stop stretching on large screens (Zoom Out) */
    
    display: flex;
    flex-wrap: wrap; /* Stack items on small screens (Zoom In) */
    gap: 20px;
}

.text {
    font-size: clamp(16px, 2vw, 24px); /* Scale text smoothly */
}
```

## 4. Checklist for New Components
- [ ] Is `max-width` set on the main content container?
- [ ] Is `flex-wrap: wrap` enabled for row layouts?
- [ ] Are font sizes using `clamp()` or relative units?
- [ ] Does the layout stack vertically on mobile?

## 5. Troubleshooting & Fixes
### Common Issues
-   **Variable Redeclaration**: Be careful when copy-pasting code blocks (e.g., `likeArtwork` logic). Ensure variables like `updatedArtwork` are not declared twice in the same scope.

## 6. Manual Management: Challenges & Streaks
Since there is no Admin UI for managing challenges or streaks yet, you must use SQL commands directly on the MySQL database (`crea_db`).

### A. How to Reset/Force a New Challenge
The system automatically creates a new challenge if the current one has expired. To force a new challenge, you can manually expire the current one.

**Step 1: Expire the Current active challenge**
Run this SQL command to set the `end_date` of the active challenge to yesterday:
```sql
UPDATE challenge 
SET end_date = NOW() - INTERVAL 1 DAY 
WHERE is_active = true;
```

**Step 2: Trigger New Challenge Generation**
Simply visit the Challenges page or call the API endpoint:
*   **URL**: `http://localhost:3000/challenges` (Frontend)
*   **API**: `GET http://localhost:8080/challenges/current`

The backend (`ChallengeService.getCurrentChallenge()`) will see no active challenge exists and automatically create a new one with a random theme.

### B. How to Manually Set a User's Streak
If you need to fix or set a user's streak manually (e.g., for testing or support).

**Step 1: Find the User's Username**
```sql
SELECT artist_id, username, streak FROM artist;
```

**Step 2: Update the Streak**
Run this command, replacing `[NEW_STREAK]` and `[USERNAME]` with your desired values:
```sql
UPDATE artist 
SET streak = [NEW_STREAK] 
WHERE username = '[USERNAME]';
```

**Example**: Set 'SimonJayed' streak to 50.
```sql
UPDATE artist SET streak = 50 WHERE username = 'SimonJayed';
```
