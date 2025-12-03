# System Styles

This document defines the global style tokens and design values used throughout the application to ensure consistency.

## Colors

| Token Name | Value | Description |
| :--- | :--- | :--- |
| `primaryColor` | `#FFB800` | Main brand color. Used for buttons, borders, highlights, and active states. |
| `primaryHover` | `#FFA500` | Hover state for primary color elements. |
| `secondaryColor` | `#FFFFFF` | Used for card backgrounds, input backgrounds, and secondary button backgrounds. |
| `backgroundColor` | `#000000` | Used for modal overlays and dark theme containers. |
| `textColor` | `#000000` | Primary text color for readability on light backgrounds. |
| `secondaryTextColor` | `#666666` | Used for subtitles, hints, and less important text. |
| `dangerColor` | `#ff4444` | Used for destructive actions (e.g., Delete button). |
| `dangerHover` | `#ff0000` | Hover state for danger/destructive actions. |
| `borderColor` | `#ddd` | Standard border color for inputs and cards. |
| `shadowColor` | `rgba(0, 0, 0, 0.1)` | Base shadow color for cards and elevated elements. |
| `shadowColorHover` | `rgba(255, 184, 0, 0.3)` | Primary color shadow for hover states. |

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

## Spacing & Layout

| Token Name | Value | Description |
| :--- | :--- | :--- |
| `modalPadding` | `24px` | Padding inside modal content areas. |
| `cardPadding` | `16px` | Padding inside content cards. |
| `inputPadding` | `10px 12px` | Padding for text inputs and textareas. |
| `buttonPadding` | `10px 24px` | Standard padding for primary action buttons. |
| `smallButtonPadding` | `6px 12px` | Padding for smaller action buttons (Edit/Delete). |
| `borderRadius` | `4px` | Standard border radius for inputs, buttons, and cards. |
| `borderRadiusLarge` | `8px` | Border radius for larger containers like modals and cards. |

## Animations & Transitions

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0.0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Animation Durations
```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
```

### Button Animations
```css
.button {
  transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 184, 0, 0.3);
}

.button:active {
  transform: translateY(0);
  transition-duration: 100ms;
}
```

### Card Hover Effects
```css
.card {
  transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
```

### Input Focus States
```css
.input {
  transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
  border: 1px solid #ddd;
}

.input:focus {
  outline: none;
  border-color: #FFB800;
  box-shadow: 0 0 0 3px rgba(255, 184, 0, 0.1);
  transform: scale(1.01);
}
```

### Icon Animations
```css
.icon {
  transition: transform 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.icon:hover {
  transform: scale(1.2);
}

.icon-like.active {
  animation: heartbeat 0.5s ease-in-out;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1.1); }
  75% { transform: scale(1.25); }
}
```

### Modal Entrance Animations
```css
@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-overlay {
  animation: modalFadeIn 250ms ease-out;
  backdrop-filter: blur(4px);
}

.modal-content {
  animation: modalSlideIn 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Image Gallery Hover
```css
.gallery-item {
  transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
  overflow: hidden;
}

.gallery-item:hover {
  transform: scale(1.02);
}

.gallery-item img {
  transition: transform 350ms ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}
```

## Masonry Layout
For artwork feeds, use a masonry layout to display images of varying heights.
- **Container**: `column-count: 3; column-gap: 20px;`
- **Item**: `break-inside: avoid; margin-bottom: 20px; transition: all 250ms ease;`
- **Responsive**: 
  - Desktop (>1200px): 3 columns
  - Tablet (768px-1199px): 2 columns
  - Mobile (<768px): 1 column

## Usage Examples

### Primary Button
```css
background-color: #FFB800;
color: #FFFFFF;
padding: 10px 24px;
border-radius: 4px;
font-weight: 600;
border: none;
cursor: pointer;
transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
position: relative;
overflow: hidden;
```

**Hover State:**
```css
background-color: #FFA500;
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(255, 184, 0, 0.3);
```

**Active State:**
```css
transform: translateY(0);
```

### Card Container
```css
background-color: #FFFFFF;
border: 1px solid #ddd;
border-radius: 8px;
padding: 16px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
cursor: pointer;
```

**Hover State:**
```css
transform: translateY(-4px);
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
```

### Modal Overlay
```css
background-color: rgba(0, 0, 0, 0.8);
z-index: 1000;
animation: modalFadeIn 250ms ease-out;
backdrop-filter: blur(4px);
```

### Input Fields
```css
padding: 10px 12px;
border: 1px solid #ddd;
border-radius: 4px;
font-size: 14px;
transition: all 250ms cubic-bezier(0.4, 0.0, 0.2, 1);
outline: none;
```

**Focus State:**
```css
border-color: #FFB800;
box-shadow: 0 0 0 3px rgba(255, 184, 0, 0.1);
transform: scale(1.01);
```

## Universal Icons
Use these icons from `react-icons/fa` (FontAwesome) consistently across the application.
- **Like**: `FaHeart` (Filled), `FaRegHeart` (Outline)
- **Comment**: `FaRegComment`
- **Share**: `FaShare`
- **Favorite**: `FaStar` (Filled), `FaRegStar` (Outline)
- **Upload**: `FaUpload`
- **Sort**: `FaSortAmountDown`
- **Sidebar**: `FaHome`, `FaCommentDots`, `FaSearch`, `FaImages`, `FaUser`, `FaCog`, `FaSignOutAlt`, `FaPalette`
- **No Data**: `FaRegFileAlt`

**Icon Behavior:**
- All interactive icons should have: `transition: transform 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55);`
- On hover: `transform: scale(1.2);`
- For like/favorite actions: Use heartbeat animation on activation

## Component Rules

### Sidebar
```css
background: #000000;
color: #FFB800;
border-right: 1px solid #FFB800;
width: 250px;
position: fixed;
height: 100vh;
transition: all 250ms ease;
```

**Sidebar Items:**
```css
padding: 12px 20px;
transition: all 200ms ease;
cursor: pointer;
display: flex;
align-items: center;
gap: 12px;
```

**Hover State:**
```css
background: rgba(255, 184, 0, 0.1);
padding-left: 24px;
```

**Active State:**
```css
background: rgba(255, 184, 0, 0.2);
border-left: 3px solid #FFB800;
```

**Logo Section:**
- Center aligned
- Color: `#FFB800`
- Bottom border: `1px solid #FFB800`

### Loading Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FFB800;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### Skeleton Loading
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

## Performance Guidelines
- **Use `transform` and `opacity`** for animations (GPU accelerated)
- **Avoid animating** `width`, `height`, `top`, `left` (causes layout recalculation)
- **Prefer `transition`** over `animation` for simple state changes
- **Use `will-change`** sparingly for complex animations only

## Accessibility
- Ensure all interactive elements have visible focus states
- Maintain color contrast ratios (WCAG AA minimum)
- Provide alternative text for icon-only buttons
- Consider `prefers-reduced-motion` for users who prefer minimal animation:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Critical Rules
- **Primary Buttons**: If background is `primaryColor` (#FFB800), text color MUST be `white` (#FFFFFF).
- **All interactive elements** must have hover states with smooth transitions.
- **All animations** should use the defined timing functions for consistency.
- **Use transform** instead of position changes for better performance.
- **Icons** should scale on hover using the bounce easing function.
- **Cards** should lift on hover with shadow enhancement.