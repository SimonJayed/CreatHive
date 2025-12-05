# System Styles - Hive Theme

This document defines the global style tokens and design values used throughout the application to ensure consistency with our honeycomb/hive aesthetic.

## Colors

| Token Name | Value | Description |
| :--- | :--- | :--- |
| `primaryColor` | `#FFB800` | Main brand color (Golden Honey). Used for buttons, borders, highlights, and active states. |
| `primaryHover` | `#FFA500` | Hover state for primary color elements. |
| `secondaryColor` | `#FFFFFF` | Used for card backgrounds, input backgrounds, and secondary button backgrounds. |
| `backgroundColor` | `#000000` | Used for modal overlays and dark theme containers (Hive Black). |
| `textColor` | `#000000` | Primary text color for readability on light backgrounds. |
| `secondaryTextColor` | `#666666` | Used for subtitles, hints, and less important text. |
| `dangerColor` | `#ff4444` | Used for destructive actions (e.g., Delete button). |
| `dangerHover` | `#ff0000` | Hover state for danger/destructive actions. |
| `borderColor` | `#ddd` | Standard border color for inputs and cards. |
| `shadowColor` | `rgba(0, 0, 0, 0.1)` | Base shadow color for cards and elevated elements. |
| `shadowColorHover` | `rgba(255, 184, 0, 0.3)` | Primary color shadow for hover states (Golden Glow). |
| `honeycombOverlay` | `rgba(255, 184, 0, 0.05)` | Subtle honeycomb pattern overlay color. |

## Typography

| Token Name | Value | Description |
| :--- | :--- | :--- |
| `fontFamily` | `'Inter', 'Segoe UI', Arial, sans-serif` | Modern font stack with fallbacks. |
| `headerFontSize` | `24px` | Size for main modal headers and section titles. |
| `subHeaderFontSize` | `18px` | Size for card titles. |
| `bodyFontSize` | `14px` | Standard size for body text, inputs, and labels. |
| `smallFontSize` | `13px` | Size for secondary text and small buttons. |
| `fontWeightBold` | `bold` / `700` | Bold weight for headers. |
| `fontWeightSemiBold` | `600` | Semi-bold weight for labels and buttons. |
| `letterSpacingWide` | `1px` | Letter spacing for branding and headers. |

## Spacing & Layout

| Token Name | Value | Description |
| :--- | :--- | :--- |
| `modalPadding` | `24px` | Padding inside modal content areas. |
| `cardPadding` | `16px` | Padding inside content cards. |
| `inputPadding` | `12px 12px 12px 40px` | Padding for text inputs (with icon space). |
| `buttonPadding` | `12px 28px` | Standard padding for primary action buttons (hexagonal). |
| `smallButtonPadding` | `6px 12px` | Padding for smaller action buttons (Edit/Delete). |
| `borderRadius` | `0` | Border radius removed for hexagonal theme. |
| `borderRadiusLarge` | `0` | Border radius removed for hexagonal theme. |
| `borderWidth` | `2px` | Standard border width for hive theme (thicker borders). |
box-shadow: 0 8px 20px rgba(255, 184, 0, 0.3);
border-color: #FFB800;
```

### Modal Overlay
```css
background-color: rgba(0, 0, 0, 0.8);
z-index: 1000;
animation: modalFadeIn 250ms ease-out;
backdrop-filter: blur(4px);
/* Optional honeycomb pattern */
background-image: url("data:image/svg+xml,...");
background-size: 100px 100px;
```

### Input Fields (Hexagonal)
```css
padding: 12px 12px 12px 40px;
border: 2px solid #ddd;
clip-path: polygon(4% 0%, 96% 0%, 100% 50%, 96% 100%, 4% 100%, 0% 50%);
font-size: 14px;
transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
outline: none;
background: #fff;
```

**Focus State:**
```css
border-color: #FFB800;
box-shadow: 0 0 0 3px rgba(255, 184, 0, 0.2);
transform: scale(1.02);
```

## Universal Icons

### Primary Icons (Lucide React)
Use these icons from `lucide-react` consistently across the application:
- **Like/Favorite**: `Hexagon` (Use fill for active state)
- **Comment**: `MessageCircle`
- **Share**: `Share2`
- **Upload**: `Upload`
- **Sort**: Use custom icon or `ArrowUpDown`
- **Sidebar**: `Home`, `MessageSquare`, `Search`, `Image`, `User`, `Settings`, `LogOut`, `Hexagon`
- **No Data**: `FileQuestion`

### Hive Branding Icon
- **Logo**: `Hexagon` (Filled with `#FFB800`, stroke-width: 2)
- Size: 40-50px for logo display

**Icon Behavior:**
- All interactive icons should have: `transition: transform 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55);`
- On hover: `transform: scale(1.2) rotate(5deg);`
- For like/favorite actions: Use hexPulse animation on activation
- Use hexagon icon for likes instead of hearts to maintain theme consistency

## Component Rules

### Sidebar (Hive Theme)
```css
background: #000000;
color: #FFB800;
border-right: 2px solid #FFB800;
width: 250px;
position: fixed;
height: 100vh;
transition: all 250ms ease;
/* Honeycomb background pattern */
background-image: url("data:image/svg+xml,...");
background-size: 100px 100px;
```

**Logo Section:**
```css
padding: 24px;
text-align: center;
border-bottom: 2px solid #FFB800;
background: rgba(0, 0, 0, 0.8); /* Semi-transparent to show pattern */
```

**Logo Text:**
```css
font-size: 20px;
letter-spacing: 1px;
font-weight: bold;
```

**Sidebar Items:**
```css
padding: 14px 20px;
transition: all 200ms ease;
cursor: pointer;
display: flex;
align-items: center;
gap: 12px;
margin: 4px 0;
```

**Hover State:**
```css
background: rgba(255, 184, 0, 0.1);
padding-left: 24px;
```

**Active State:**
```css
background: rgba(255, 184, 0, 0.2);
border-left: 4px solid #FFB800;
clip-path: polygon(0 0, 100% 0, 95% 100%, 0% 100%);
```

### Main Content Area
```css
background: #fafafa;
/* Honeycomb background pattern */
background-image: url("data:image/svg+xml,...");
background-size: 100px 100px;
```

### Header Bar
```css
background: #fff;
padding: 20px 40px;
border-bottom: 2px solid #FFB800;
box-shadow: 0 4px 8px rgba(255, 184, 0, 0.1);
position: sticky;
top: 0;
z-index: 100;
```

### Loading Spinner (Hexagonal)
```css
@keyframes hexSpin {
  to { transform: rotate(360deg); }
}

.spinner-hexagon {
  width: 50px;
  height: 50px;
  clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
  background: #FFB800;
  animation: hexSpin 1.5s linear infinite;
}
```

### Skeleton Loading (Honeycomb)
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #FFB800 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  clip-path: polygon(0% 2.5%, 50% 0%, 100% 2.5%, 100% 97.5%, 50% 100%, 0% 97.5%);
}
```

## Performance Guidelines
- **Use `transform` and `opacity`** for animations (GPU accelerated)
- **Avoid animating** `width`, `height`, `top`, `left` (causes layout recalculation)
- **Prefer `transition`** over `animation` for simple state changes
- **Use `will-change`** sparingly for complex animations only
- **Clip-path animations** are GPU accelerated but use sparingly on many elements

## Accessibility
- Ensure all interactive elements have visible focus states
- Maintain color contrast ratios (WCAG AA minimum)
  - `#FFB800` on `#000000` = 9.87:1 (AAA compliant)
  - `#000000` on `#FFFFFF` = 21:1 (AAA compliant)
- Provide alternative text for icon-only buttons
- Consider `prefers-reduced-motion` for users who prefer minimal animation:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Critical Rules - Hive Theme
- **Primary Buttons**: If background is `primaryColor` (#FFB800), text color MUST be `white` (#FFFFFF).
- **All interactive elements** must have hover states with smooth transitions.
- **All animations** should use the defined timing functions for consistency.
- **Use transform** instead of position changes for better performance.
- **Icons** should scale and rotate slightly on hover using the bounce easing function.
- **Cards** must use hexagonal clip-path for theme consistency.
- **Buttons and inputs** must use appropriate hexagonal clip-paths.
- **Use hexagon icons** for likes/favorites instead of hearts.
- **Logo must be Hexagon icon** filled with `#FFB800`.
- **Borders should be 2px** for emphasis on the hive structure.
- **Apply honeycomb background pattern** to sidebar and main content areas.
- **Maintain letter-spacing** on branding elements for premium feel.

## Tab Navigation
Styles for tabbed interfaces (e.g., Profile page):
```css
.tab-button {
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: 600;
  color: var(--secondaryTextColor);
  cursor: pointer;
  position: relative;
  transition: color 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
  font-family: var(--fontFamily);
}

.tab-button:hover,
.tab-button.active {
  color: var(--primaryColor);
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--primaryColor);
}
```