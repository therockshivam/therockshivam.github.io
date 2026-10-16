/**
 * Path & Routing Utility Module
 * Enforces robust, location-agnostic path resolution across local and production environments.
 */

/**
 * Resolves a path relative to the root of the application or current document location.
 * 
 * @param {string} relativePath - Path relative to root or current page (e.g., 'components/common/navbar.html')
 * @returns {string} Fully resolved absolute URL string
 */
export function getAbsoluteUrl(relativePath) {
  if (!relativePath || relativePath === '#') return '#';

  // Remove leading slash to ensure relative resolution against base
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;

  // Use current document's base URL (handles <base> tags or page location)
  return new URL(cleanPath, document.baseURI).href;
}

/**
 * Returns the current application base path directory ending with a slash.
 * Works for both root domains (/) and GitHub Pages repository subpaths (/repo-name/).
 * 
 * @returns {string} Base path URL string
 */
export function getAppBasePath() {
  const origin = window.location.origin;
  const pathname = window.location.pathname;

  // Determine directory path of current document
  const directory = pathname.substring(0, pathname.lastIndexOf('/') + 1);
  return `${origin}${directory}`;
}

export class Utils {
  // Load the header dynamically
  static getNavbar(location) {
    fetch(getAbsoluteUrl(location))
      .then(response => response.text())
      .then(data => {
        const el = document.getElementById('navbar');
        if (el) el.innerHTML = data;
      });
  }

  // Load the footer dynamically
  static getFooter(location) {
    fetch(getAbsoluteUrl(location))
      .then(response => response.text())
      .then(data => {
        const el = document.getElementById('footer');
        if (el) el.innerHTML = data;
      });
  }
}