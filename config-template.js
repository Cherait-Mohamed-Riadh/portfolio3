/**
 * Configuration Template for Portfolio Contact Form Backend
 * 
 * Copy this configuration and update it with your actual values
 * in the Google Apps Script editor.
 */

const CONFIG = {
  // ===== REQUIRED SETTINGS =====
  
  // Your personal email address to receive contact form notifications
  ADMIN_EMAIL: 'your-email@gmail.com',
  
  // CORS settings - specify which domains can access your backend
  // Use '*' for development/testing, restrict to your domain for production
  ALLOW_ORIGIN: '*', // Change to 'https://yourdomain.com' for production
  
  // ===== OPTIONAL SETTINGS =====
  
  // Google Sheets storage - set to false to disable
  ENABLE_STORAGE: true,
  
  // Google Sheet ID (optional) - leave empty to disable storage
  // To get this: create a Google Sheet, copy the ID from the URL
  // URL format: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
  SHEET_ID: '', // Example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
  
  // Name of the sheet tab where data will be stored
  SHEET_NAME: 'Contact Submissions',
  
  // Honeypot field name for spam protection
  // This should match the hidden field in your HTML form
  HONEYPOT_FIELD: 'website'
};

// ===== EXAMPLE CONFIGURATIONS =====

// Development/Testing Configuration
const DEV_CONFIG = {
  ADMIN_EMAIL: 'your-email@gmail.com',
  ALLOW_ORIGIN: '*',
  ENABLE_STORAGE: false,
  SHEET_ID: '',
  SHEET_NAME: 'Contact Submissions',
  HONEYPOT_FIELD: 'website'
};

// Production Configuration
const PROD_CONFIG = {
  ADMIN_EMAIL: 'your-email@gmail.com',
  ALLOW_ORIGIN: 'https://yourdomain.com',
  ENABLE_STORAGE: true,
  SHEET_ID: 'your-actual-sheet-id-here',
  SHEET_NAME: 'Contact Submissions',
  HONEYPOT_FIELD: 'website'
};

// Minimal Configuration (Email only, no storage)
const MINIMAL_CONFIG = {
  ADMIN_EMAIL: 'your-email@gmail.com',
  ALLOW_ORIGIN: 'https://yourdomain.com',
  ENABLE_STORAGE: false,
  SHEET_ID: '',
  SHEET_NAME: 'Contact Submissions',
  HONEYPOT_FIELD: 'website'
};

// ===== HOW TO USE =====

/*
1. Copy the CONFIG object above
2. Replace the values with your actual settings
3. Paste it into your Google Apps Script editor
4. Save and deploy your script

IMPORTANT NOTES:
- ADMIN_EMAIL must be a valid Gmail address
- ALLOW_ORIGIN should be restricted to your domain in production
- SHEET_ID is optional - leave empty if you don't want Google Sheets storage
- The honeypot field helps prevent spam but should remain hidden from users
*/

// ===== VALIDATION =====

// You can add this function to validate your configuration
function validateConfig() {
  const errors = [];
  
  if (!CONFIG.ADMIN_EMAIL || !CONFIG.ADMIN_EMAIL.includes('@')) {
    errors.push('ADMIN_EMAIL must be a valid email address');
  }
  
  if (!CONFIG.ALLOW_ORIGIN) {
    errors.push('ALLOW_ORIGIN cannot be empty');
  }
  
  if (CONFIG.ENABLE_STORAGE && !CONFIG.SHEET_ID) {
    errors.push('SHEET_ID is required when ENABLE_STORAGE is true');
  }
  
  if (CONFIG.SHEET_ID && !CONFIG.SHEET_NAME) {
    errors.push('SHEET_NAME is required when SHEET_ID is provided');
  }
  
  if (errors.length > 0) {
    console.error('Configuration errors:', errors);
    return false;
  }
  
  console.log('Configuration is valid!');
  return true;
}

// Run validation
// validateConfig();
