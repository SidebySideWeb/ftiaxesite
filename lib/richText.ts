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
 * Converts Lexical node to HTML string
 */
function lexicalToHTML(node: any): string {
  if (!node) return ''
  
  let html = ''
  
  // Handle text nodes
  if (node.text) {
    let text = node.text
    
    // Apply formatting
    if (node.format) {
      if (node.format & 1) text = `<strong>${text}</strong>` // bold
      if (node.format & 2) text = `<em>${text}</em>` // italic
      if (node.format & 4) text = `<u>${text}</u>` // underline
      if (node.format & 8) text = `<code>${text}</code>` // code
    }
    
    html += text
  }
  
  // Handle block elements
  if (node.type === 'paragraph') {
    const childrenHTML = node.children
      ? node.children.map((child: any) => lexicalToHTML(child)).join('')
      : ''
    html = `<p>${childrenHTML}</p>`
  } else if (node.type === 'heading') {
    const level = node.tag || 'h1'
    const childrenHTML = node.children
      ? node.children.map((child: any) => lexicalToHTML(child)).join('')
      : ''
    html = `<${level}>${childrenHTML}</${level}>`
  } else if (node.type === 'link') {
    const url = node.fields?.url || '#'
    const childrenHTML = node.children
      ? node.children.map((child: any) => lexicalToHTML(child)).join('')
      : ''
    html = `<a href="${url}">${childrenHTML}</a>`
  } else if (node.type === 'list') {
    const listTag = node.listType === 'number' ? 'ol' : 'ul'
    const childrenHTML = node.children
      ? node.children.map((child: any) => `<li>${lexicalToHTML(child)}</li>`).join('')
      : ''
    html = `<${listTag}>${childrenHTML}</${listTag}>`
  } else if (node.children && Array.isArray(node.children)) {
    // Generic container - process children
    html = node.children.map((child: any) => lexicalToHTML(child)).join('')
  }
  
  return html
}

