/**
 * Utility function to render rich text content from Payload CMS
 * Handles both plain text strings and Lexical JSON format
 */
export function renderRichText(content: any): string {
  // If content is null/undefined, return empty string
  if (!content) return ''
  
  // If it's already a string, return as-is
  if (typeof content === 'string') return content
  
  // If it's a Lexical JSON object, we need to serialize it
  // For now, extract text content from Lexical JSON
  if (typeof content === 'object' && content.root) {
    return extractTextFromLexical(content.root)
  }
  
  // Fallback: try to stringify or return empty
  return ''
}

/**
 * Extracts plain text from Lexical JSON structure
 */
function extractTextFromLexical(node: any): string {
  if (!node) return ''
  
  let text = ''
  
  // If node has text property, add it
  if (node.text) {
    text += node.text
  }
  
  // If node has children, recursively process them
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child: any) => {
      text += extractTextFromLexical(child)
    })
  }
  
  return text
}

/**
 * Converts rich text to HTML with basic formatting
 * For simple use cases where you just need basic HTML rendering
 */
export function richTextToHTML(content: any): string {
  if (!content) return ''
  
  // If it's already a string, return as-is
  if (typeof content === 'string') return content
  
  // If it's Lexical JSON, convert to HTML
  if (typeof content === 'object' && content.root) {
    return lexicalToHTML(content.root)
  }
  
  return ''
}

/**
 * Converts Lexical node to HTML string with proper formatting
 */
function lexicalToHTML(node: any): string {
  if (!node) return ''
  
  let html = ''
  
  // Handle text nodes
  if (node.text !== undefined) {
    let text = escapeHTML(node.text)
    
    // Apply text formatting (Lexical uses bitwise flags)
    if (node.format) {
      if (node.format & 1) text = `<strong>${text}</strong>` // bold
      if (node.format & 2) text = `<em>${text}</em>` // italic
      if (node.format & 8) text = `<s>${text}</s>` // strikethrough
      if (node.format & 4) text = `<u>${text}</u>` // underline
      if (node.format & 16) text = `<code class="inline-code">${text}</code>` // code
      if (node.format & 32) text = `<sub>${text}</sub>` // subscript
      if (node.format & 64) text = `<sup>${text}</sup>` // superscript
    }
    
    return text
  }
  
  // Handle block and inline elements by type
  switch (node.type) {
    case 'root':
      // Root node - just process children
      return node.children
        ? node.children.map((child: any) => lexicalToHTML(child)).join('')
        : ''
    
    case 'paragraph':
      const pChildren = node.children
        ? node.children.map((child: any) => lexicalToHTML(child)).join('')
        : ''
      return `<p>${pChildren || '<br>'}</p>`
    
    case 'heading':
      const level = node.tag || 'h2'
      const hChildren = node.children
        ? node.children.map((child: any) => lexicalToHTML(child)).join('')
        : ''
      return `<${level}>${hChildren}</${level}>`
    
    case 'list':
      const listTag = node.listType === 'number' ? 'ol' : 'ul'
      const listChildren = node.children
        ? node.children.map((child: any) => lexicalToHTML(child)).join('')
        : ''
      return `<${listTag}>${listChildren}</${listTag}>`
    
    case 'listitem':
      const liChildren = node.children
        ? node.children.map((child: any) => lexicalToHTML(child)).join('')
        : ''
      return `<li>${liChildren}</li>`
    
    case 'link':
      const url = node.fields?.url || node.url || '#'
      const linkChildren = node.children
        ? node.children.map((child: any) => lexicalToHTML(child)).join('')
        : ''
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${escapeHTML(url)}"${target}>${linkChildren}</a>`
    
    case 'quote':
      const quoteChildren = node.children
        ? node.children.map((child: any) => lexicalToHTML(child)).join('')
        : ''
      return `<blockquote>${quoteChildren}</blockquote>`
    
    case 'code':
      const codeChildren = node.children
        ? node.children.map((child: any) => lexicalToHTML(child)).join('')
        : ''
      return `<pre><code>${codeChildren}</code></pre>`
    
    case 'linebreak':
      return '<br>'
    
    default:
      // Generic container - process children if they exist
      if (node.children && Array.isArray(node.children)) {
        return node.children.map((child: any) => lexicalToHTML(child)).join('')
      }
      return ''
  }
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHTML(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

