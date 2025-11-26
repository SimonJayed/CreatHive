# Development Tutorials

This document contains step-by-step tutorials for implementing key features in the CreatHive application.

## Tutorial 1: Full-Screen Scroll-Snap Sections

### Overview
Creating a smooth, full-screen scrolling experience where each section snaps into place when the user scrolls.

### Problem
By default, scrolling is continuous and doesn't naturally align sections to fill the viewport.

### Solution: CSS Scroll Snap

#### Step 1: Set up the Container
```css
.scroll-container {
  height: 100vh;           /* Full viewport height */
  overflow-y: scroll;      /* Enable vertical scrolling */
  scroll-snap-type: y mandatory;  /* Snap in Y direction */
  scroll-behavior: smooth; /* Smooth scrolling */
}
```

**Explanation:**
- `height: 100vh` - Makes the container exactly as tall as the viewport
- `overflow-y: scroll` - Allows vertical scrolling
- `scroll-snap-type: y mandatory` - Forces scroll to snap to defined points on Y axis
- `scroll-behavior: smooth` - Adds smooth animation when scrolling

#### Step 2: Create Full-Screen Sections
```css
.section {
  height: 100vh;           /* Each section fills viewport */
  scroll-snap-align: start; /* Snap to the start of each section */
}
```

**Explanation:**
- `height: 100vh` - Each section is exactly one viewport tall
- `scroll-snap-align: start` - Tells the browser to snap to the top of this element

#### Step 3: React Implementation
```javascript
<div style={{
  height: '100vh',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
  scrollBehavior: 'smooth'
}}>
  <div style={{ height: '100vh', scrollSnapAlign: 'start' }}>
    Section 1
  </div>
  <div style={{ height: '100vh', scrollSnapAlign: 'start' }}>
    Section 2
  </div>
</div>
```

### Browser Compatibility
- Modern browsers support scroll-snap
- For older browsers, sections will still work but won't snap

---

## Tutorial 2: Full-Screen Page Fit (No Scrolling)

### Overview
Making pages fit entirely within the viewport without vertical scrolling.

### Problem
Content often extends beyond the viewport, requiring scrolling.

### Solution: Strategic Layout with Flexbox

#### Step 1: Main Container Setup
```css
.page-container {
  height: 100vh;           /* Full viewport height */
  display: flex;
  flex-direction: column;
  overflow: hidden;        /* Prevent page scrolling */
}
```

**Explanation:**
- `height: 100vh` - Container is exactly viewport height
- `overflow: hidden` - Prevents the entire page from scrolling
- `flex-direction: column` - Stacks children vertically

#### Step 2: Header (Fixed Size)
```css
.header {
  flex-shrink: 0;          /* Don't shrink */
  padding: 20px;
}
```

#### Step 3: Content Area (Scrollable if needed)
```css
.content {
  flex: 1;                 /* Take remaining space */
  overflow-y: auto;        /* Allow internal scrolling if needed */
  padding: 20px;
}
```

**Explanation:**
- `flex: 1` - Content expands to fill available space
- `overflow-y: auto` - Only this section scrolls if content is too large

#### Step 4: Footer (Fixed Size)
```css
.footer {
  flex-shrink: 0;
  padding: 20px;
}
```

#### React Implementation Example
```javascript
<div style={{
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}}>
  {/* Header - fixed height */}
  <div style={{ flexShrink: 0, padding: '20px' }}>
    <h1>Title</h1>
  </div>
  
  {/* Content - fills remaining space */}
  <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
    {/* Scrollable content */}
  </div>
  
  {/* Footer - fixed height */}
  <div style={{ flexShrink: 0, padding: '20px' }}>
    <button>Submit</button>
  </div>
</div>
```

### Common Pitfalls

#### Pitfall 1: Padding Not Accounted For
```javascript
// ❌ Wrong - padding adds to height
<div style={{ height: '100vh', padding: '40px' }}>
  {/* Total height is 100vh + 80px */}
</div>

// ✅ Correct - use box-sizing
<div style={{ 
  height: '100vh', 
  padding: '40px',
  boxSizing: 'border-box' 
}}>
  {/* Total height is exactly 100vh */}
</div>
```

#### Pitfall 2: Nested Heights
```javascript
// ❌ Wrong - child can't be 100vh if parent is also 100vh with padding
<div style={{ height: '100vh', padding: '20px' }}>
  <div style={{ height: '100vh' }}>...</div>
</div>

// ✅ Correct - use flex or calc
<div style={{ height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
  <div style={{ height: '100%' }}>...</div>
</div>
```

#### Pitfall 3: Zoom Levels
When users zoom out, content might overflow:

```javascript
// ✅ Solution: Use max-height with a scrollable container
<div style={{
  height: '100vh',
  maxHeight: '100vh',
  overflowY: 'auto'
}}>
```

---

## Tutorial 3: Responsive Form Layouts

### Using CSS Grid for Compact Forms
```javascript
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  padding: '20px'
}}>
  <div>Left field</div>
  <div>Right field</div>
  <div style={{ gridColumn: '1 / -1' }}>Full width field</div>
</div>
```

**Explanation:**
- `gridTemplateColumns: '1fr 1fr'` - Two equal columns
- `gap: '20px'` - Space between grid items
- `gridColumn: '1 / -1'` - Span from first to last column

---

## Best Practices

1. **Always use `box-sizing: border-box`** when working with `100vh`
2. **Test at different zoom levels** (50%, 75%, 100%, 125%, 150%)
3. **Use `overflow-y: auto`** instead of `scroll` to hide scrollbar when not needed
4. **Consider minimum heights** for content that might be too small on large screens
5. **Use flexbox for vertical centering** within full-screen containers

---

## Quick Reference

### Full-Screen Container
```javascript
style={{
  height: '100vh',
  boxSizing: 'border-box',
  overflow: 'hidden'
}}
```

### Scroll-Snap Container
```javascript
style={{
  height: '100vh',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
  scrollBehavior: 'smooth',
  WebkitOverflowScrolling: 'touch'  // Smooth scrolling on iOS
}}
```

### Scroll-Snap Section
```javascript
style={{
  height: '100vh',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always'  // Force snap on every section
}}
```

---

## Tutorial 4: Sidebar Navigation with Icon Buttons

### Overview
Creating a vertical sidebar navigation with icon-only buttons that change appearance based on active state.

### Problem
Need a compact, visually appealing navigation that doesn't take up much horizontal space and clearly indicates the current active page.

### Solution: Fixed Sidebar with State-Based Styling

#### Step 1: Main Layout with Sidebar
```javascript
<div style={{ display: 'flex', height: '100vh' }}>
  {/* Sidebar - Fixed width */}
  <div style={{ width: '80px', flexShrink: 0 }}>
    {/* Sidebar content */}
  </div>
  
  {/* Main Content - Fills remaining space */}
  <div style={{ flex: 1 }}>
    {/* Page content */}
  </div>
</div>
```

**Explanation:**
- `display: 'flex'` - Side-by-side layout
- `width: '80px'` on sidebar - Fixed width that won't change
- `flex: 1` on content - Takes all remaining horizontal space
- `flexShrink: 0` - Prevents sidebar from shrinking

#### Step 2: State Management for Active Tab
```javascript
const [activeTab, setActiveTab] = useState('home');
```

**Explanation:**
- Tracks which page is currently active
- Used to conditionally style navigation buttons
- Updated when user clicks navigation buttons

#### Step 3: Dynamic Button Styling Function
```javascript
const navButtonStyle = (tabName) => ({
  display: 'block',
  width: '100%',
  padding: '12px 20px',
  marginBottom: '10px',
  backgroundColor: activeTab === tabName ? '#FFB800' : 'transparent',
  color: activeTab === tabName ? 'black' : '#FFB800',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s'
});
```

**Explanation:**
- Function takes `tabName` parameter to compare with `activeTab`
- **Active state**: Yellow background (#FFB800), black text
- **Inactive state**: Transparent background, yellow text
- `transition: 'all 0.2s'` - Smooth animation when switching states

#### Step 4: Creating Navigation Buttons
```javascript
<button
  style={{
    ...navButtonStyle('home'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px'
  }}
  onClick={() => setActiveTab('home')}
  title="Home"
>
  🏠
</button>
```

**Explanation:**
- `...navButtonStyle('home')` - Spreads the dynamic styles
- Additional inline styles override specific properties
- `onClick` - Updates active tab state
- `title` - Shows tooltip on hover
- Emoji icon - Visual representation of the page

#### Step 5: Rendering Content Based on Active Tab
```javascript
const renderContent = () => {
  switch (activeTab) {
    case 'home':
      return <HomePage />;
    case 'profile':
      return <Profile />;
    case 'settings':
      return <Settings />;
    default:
      return null;
  }
};

// In JSX:
<div>{renderContent()}</div>
```

**Explanation:**
- `switch` statement determines which component to render
- Only one component rendered at a time
- No routing library needed for simple navigation

#### Complete Sidebar Example
```javascript
function Homepage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  const navButtonStyle = (tabName) => ({
    display: 'block',
    width: '100%',
    padding: '12px 20px',
    marginBottom: '10px',
    backgroundColor: activeTab === tabName ? '#FFB800' : 'transparent',
    color: activeTab === tabName ? 'black' : '#FFB800',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '80px',
        backgroundColor: 'black',
        borderRight: '1px solid #333',
        padding: '30px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Navigation Buttons */}
        <nav style={{ flex: 1, width: '100%', padding: '0 15px' }}>
          <button
            style={navButtonStyle('home')}
            onClick={() => setActiveTab('home')}
          >
            🏠
          </button>
          <button
            style={navButtonStyle('profile')}
            onClick={() => setActiveTab('profile')}
          >
            👤
          </button>
        </nav>

        {/* Logout at bottom */}
        <button onClick={onLogout} style={{ marginTop: 'auto' }}>
          🚪
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1 }}>
        {renderContent()}
      </div>
    </div>
  );
}
```

### Key Concepts

1. **Flexbox for Layout**: Sidebar and content are flex children
2. **State-Based Styling**: Active tab determines button appearance
3. **Conditional Rendering**: Switch statement renders appropriate component
4. **Icon-Only Navigation**: Compact design with emoji icons
5. **Fixed Positioning**: Logout button always at bottom with `marginTop: 'auto'`

### Best Practices

1. **Use descriptive titles** on buttons for accessibility
2. **Add transitions** for smooth visual feedback
3. **Keep sidebar width fixed** for consistent layout
4. **Use semantic HTML** (`<nav>` for navigation)
5. **Consider keyboard navigation** with tab indices
