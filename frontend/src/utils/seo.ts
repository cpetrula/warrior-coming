/**
 * Updates the page title and meta description dynamically
 * @param title - The title to set (will be appended with " - Warrior Coming")
 * @param description - The meta description to set (optional)
 */
export function updatePageMetadata(title: string, description?: string) {
  // Update document title
  document.title = title ? `${title}` : 'Warrior Coming'
  
  // Update meta description
  let metaTag = document.querySelector('meta[name="description"]')
  
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute('name', 'description')
    document.head.appendChild(metaTag)
  }
  
  // Only set content if description is provided and not empty
  if (description && description.trim()) {
    metaTag.setAttribute('content', description.trim())
  } else {
    // Set empty content instead of removing tag
    metaTag.setAttribute('content', '')
  }
}
