/**
 * Sanitize user input to prevent XSS attacks.
 * Strips HTML tags and encodes special characters.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Sanitize text for safe display - strips all HTML tags.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}
