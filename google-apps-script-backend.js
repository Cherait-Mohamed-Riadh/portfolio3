/**
 * Portfolio Contact Form Backend - Google Apps Script
 * 
 * This script handles contact form submissions from your portfolio website.
 * It includes spam protection, email notifications, and optional Google Sheets storage.
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Save the project
 * 5. Click "Deploy" > "New deployment"
 * 6. Choose "Web app" as the type
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone"
 * 9. Click "Deploy" and copy the web app URL
 * 10. Use that URL in your portfolio website's contact form
 */

// ===== CONFIGURATION =====
const CONFIG = {
  // Your personal email address to receive notifications
  ADMIN_EMAIL: 'mohamedriadhch@gmail.com',
  
  // CORS settings - replace with your actual domain
  ALLOW_ORIGIN: '*', // Change to your domain like 'https://yourdomain.com' for production
  
  // Google Sheets storage (optional)
  ENABLE_STORAGE: true, // Set to false to disable Google Sheets storage
  SHEET_ID: '', // Replace with your Google Sheet ID (optional)
  SHEET_NAME: 'Contact Submissions' // Name of the sheet tab
  
  // Honeypot field name (hidden field to catch bots)
  HONEYPOT_FIELD: 'website'
};

// ===== MAIN FUNCTION =====
function doPost(e) {
  try {
    // Set CORS headers
    setCorsHeaders();
    
    // Parse the request data
    const data = parseRequestData(e);
    
    // Validate the request
    const validation = validateRequest(data);
    if (!validation.valid) {
      return createErrorResponse(validation.error, 400);
    }
    
    // Check honeypot (spam protection)
    if (data.website && data.website.trim() !== '') {
      // Bot detected - silently ignore but return success to avoid revealing the honeypot
      return createSuccessResponse();
    }
    
    // Send email notification
    const emailSent = sendEmailNotification(data);
    if (!emailSent) {
      return createErrorResponse('Failed to send email notification', 500);
    }
    
    // Store in Google Sheets if enabled
    if (CONFIG.ENABLE_STORAGE && CONFIG.SHEET_ID) {
      const stored = storeInGoogleSheets(data);
      if (!stored) {
        console.warn('Failed to store data in Google Sheets, but email was sent');
      }
    }
    
    // Return success response
    return createSuccessResponse();
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// ===== CORS SUPPORT =====
function setCorsHeaders() {
  const headers = {
    'Access-Control-Allow-Origin': CONFIG.ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
  
  // Set headers for the response
  Object.keys(headers).forEach(key => {
    if (headers[key]) {
      // Note: In Google Apps Script, we can't directly set response headers
      // These are handled by the return object
    }
  });
}

// ===== REQUEST PARSING =====
function parseRequestData(e) {
  let data = {};
  
  // Handle different content types
  if (e.postData && e.postData.contents) {
    const contentType = e.postData.type || '';
    
    if (contentType.includes('application/json')) {
      // JSON data
      try {
        data = JSON.parse(e.postData.contents);
      } catch (error) {
        throw new Error('Invalid JSON data');
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      // Form data
      const params = e.parameter;
      Object.keys(params).forEach(key => {
        data[key] = params[key];
      });
    } else {
      // Try to parse as form data anyway
      const params = e.parameter;
      Object.keys(params).forEach(key => {
        data[key] = params[key];
      });
    }
  }
  
  return data;
}

// ===== VALIDATION =====
function validateRequest(data) {
  // Check required fields
  const requiredFields = ['name', 'email', 'subject', 'message'];
  
  for (const field of requiredFields) {
    if (!data[field] || data[field].trim() === '') {
      return {
        valid: false,
        error: `Missing required field: ${field}`
      };
    }
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    return {
      valid: false,
      error: 'Invalid email format'
    };
  }
  
  // Validate field lengths
  if (data.name.trim().length < 2) {
    return {
      valid: false,
      error: 'Name must be at least 2 characters long'
    };
  }
  
  if (data.subject.trim().length < 5) {
    return {
      valid: false,
      error: 'Subject must be at least 5 characters long'
    };
  }
  
  if (data.message.trim().length < 10) {
    return {
      valid: false,
      error: 'Message must be at least 10 characters long'
    };
  }
  
  return { valid: true };
}

// ===== EMAIL NOTIFICATION =====
function sendEmailNotification(data) {
  try {
    const subject = data.subject.trim() !== '' 
      ? `New Portfolio Message: ${data.subject.trim()}`
      : 'New Portfolio Message';
    
    const messageBody = `
New contact form submission from your portfolio website:

Name: ${data.name.trim()}
Email: ${data.email.trim()}
Subject: ${data.subject.trim()}

Message:
${data.message.trim()}

---
This message was sent from your portfolio contact form.
Reply directly to this email to respond to the sender.
    `.trim();
    
    // Send email with reply-to set to the sender's email
    GmailApp.sendEmail(
      CONFIG.ADMIN_EMAIL,
      subject,
      messageBody,
      {
        replyTo: data.email.trim(),
        name: 'Portfolio Contact Form'
      }
    );
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// ===== GOOGLE SHEETS STORAGE =====
function storeInGoogleSheets(data) {
  try {
    if (!CONFIG.SHEET_ID) {
      return false;
    }
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      
      // Add headers
      sheet.getRange(1, 1, 1, 5).setValues([
        ['Timestamp', 'Name', 'Email', 'Subject', 'Message']
      ]);
      
      // Style headers
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      sheet.getRange(1, 1, 1, 5).setBackground('#f0f0f0');
    }
    
    // Add new row
    const timestamp = new Date();
    const newRow = [
      timestamp,
      data.name.trim(),
      data.email.trim(),
      data.subject.trim(),
      data.message.trim()
    ];
    
    sheet.appendRow(newRow);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 5);
    
    return true;
  } catch (error) {
    console.error('Failed to store in Google Sheets:', error);
    return false;
  }
}

// ===== RESPONSE HELPERS =====
function createSuccessResponse() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(error, statusCode = 400) {
  const response = ContentService
    .createTextOutput(JSON.stringify({ 
      ok: false, 
      error: error 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Note: Google Apps Script doesn't support custom HTTP status codes
  // The response will always be 200, but you can check the 'ok' field in your frontend
  return response;
}

// ===== OPTIONS HANDLER FOR CORS =====
function doOptions(e) {
  setCorsHeaders();
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ===== TEST FUNCTION =====
function testFunction() {
  // This function can be used to test the script
  // Run it from the Google Apps Script editor
  console.log('Script is working correctly!');
  
  // Test email sending (uncomment to test)
  // const testData = {
  //   name: 'Test User',
  //   email: 'test@example.com',
  //   subject: 'Test Message',
  //   message: 'This is a test message from the Google Apps Script backend.'
  // };
  // sendEmailNotification(testData);
}
