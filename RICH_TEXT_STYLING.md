# Rich Text Content Styling Guide

## Overview

This frontend site supports rich text content from Payload CMS with full styling for all editor elements including lists, formatting, links, and more.

## Supported Elements

### Text Formatting
- **Bold text** - `<strong>`
- *Italic text* - `<em>`
- <u>Underlined text</u> - `<u>`
- ~~Strikethrough text~~ - `<s>`
- `Inline code` - `<code class="inline-code">`
- Superscript<sup>1</sup> - `<sup>`
- Subscript<sub>2</sub> - `<sub>`

### Block Elements
- **Paragraphs** - Proper spacing between paragraphs
- **Headings** (H1-H6) - Styled with brand colors and appropriate sizing
- **Bulleted lists** (ul/li) - With disc markers and proper indentation
- **Numbered lists** (ol/li) - With decimal markers and proper indentation
- **Nested lists** - Full support for multi-level lists
- **Blockquotes** - Styled with teal border and background
- **Code blocks** - Dark theme with syntax highlighting ready

### Interactive Elements
- **Links** - Styled with brand teal color and hover effects
- **External links** - Opens in new tab when configured in CMS

## Usage in Components

To render rich text content with proper styling:

```tsx
import { richTextToHTML } from '@/lib/richText'

// In your component
<div 
  className="rich-text"
  dangerouslySetInnerHTML={{ __html: richTextToHTML(content) }}
/>
```

### Example

```tsx
import { richTextToHTML } from '@/lib/richText'

export default function MyComponent({ data }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1>My Page</h1>
      
      <div 
        className="rich-text text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: richTextToHTML(data.content) }}
      />
    </div>
  )
}
```

## Styling Customization

All rich text styles are defined in `app/globals.css` under the `.rich-text` class:

```css
@layer components {
  .rich-text {
    /* Base styles */
  }
  
  .rich-text p {
    /* Paragraph styles */
  }
  
  .rich-text ul {
    /* Unordered list styles */
  }
  
  /* ... etc */
}
```

### Customizing Styles

To customize rich text appearance:

1. Open `app/globals.css`
2. Find the `.rich-text` section in `@layer components`
3. Modify the Tailwind classes for specific elements

Example - Change link color:
```css
.rich-text a {
  @apply text-blue-600 hover:text-blue-800 underline;
}
```

Example - Change list spacing:
```css
.rich-text ul {
  @apply list-disc ml-8 mb-6 space-y-3;
}
```

## Components Using Rich Text

Rich text is currently used in:

- **Hero Section** - `subheadline` field
- **Features Section** - `subtitle` and feature `description` fields
- **Process Section** - `subtitle` and step `description` fields
- **Contact Section** - `subtitle` field

## HTML Escaping & Security

The `richTextToHTML` utility automatically escapes HTML special characters to prevent XSS attacks while preserving the formatting structure from the CMS.

## Lexical JSON to HTML Conversion

The conversion process:
1. Payload CMS stores content in Lexical JSON format
2. Frontend `richTextToHTML()` function converts JSON to HTML
3. HTML is rendered with `.rich-text` CSS classes applied
4. All formatting, lists, and links are preserved

## Browser Compatibility

All styling uses standard CSS and Tailwind utilities, ensuring compatibility with:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## Performance

Rich text conversion happens on the server during SSR, ensuring:
- Fast page loads
- SEO-friendly HTML content
- No client-side JavaScript for rendering

