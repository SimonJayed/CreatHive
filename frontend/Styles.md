# System Styles

This document defines the global style tokens and design values used throughout the application to ensure consistency.

## Colors

| Token Name | Value | Description |
| :--- | :--- | :--- |
| `primaryColor` | `#FFB800` | Main brand color. Used for buttons, borders, highlights, and active states. |
| `secondaryColor` | `#FFFFFF` | Used for card backgrounds, input backgrounds, and secondary button backgrounds. |
| `backgroundColor` | `#000000` | Used for modal overlays and dark theme containers. |
| `textColor` | `#000000` | Primary text color for readability on light backgrounds. |
| `secondaryTextColor` | `#666666` | Used for subtitles, hints, and less important text. |
| `dangerColor` | `#ff4444` | Used for destructive actions (e.g., Delete button). |
| `borderColor` | `#ddd` | Standard border color for inputs and cards. |

## Typography

| Token Name | Value | Description |
| :--- | :--- | :--- |
| `fontFamily` | `Arial, sans-serif` | Default system font stack. |
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

## Usage Examples

### Primary Button
```css
background-color: #FFB800;
color: #FFFFFF;
padding: 10px 24px;
border-radius: 4px;
font-weight: 600;
```

### Card Container
```css
background-color: #FFFFFF;
border: 1px solid #ddd;
border-radius: 8px;
padding: 16px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
```

### Modal Overlay
```css
background-color: rgba(0, 0, 0, 0.8);
z-index: 1000;
```
