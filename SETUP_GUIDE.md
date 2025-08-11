# Portfolio Contact Form Backend Setup Guide

This guide will help you set up a 100% free backend for your portfolio website using Google Apps Script.

## 🚀 Quick Start

### Step 1: Deploy Google Apps Script Backend

1. **Go to Google Apps Script**
   - Visit: https://script.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "New Project"
   - Give it a name like "Portfolio Contact Form Backend"

3. **Replace Default Code**
   - Delete the default `Code.gs` content
   - Copy and paste the entire content from `google-apps-script-backend.js`

4. **Configure Settings**
   - In the script, update the `CONFIG` object:
     ```javascript
     const CONFIG = {
       ADMIN_EMAIL: 'mohamedriadhch@gmail.com', // Your email
       ALLOW_ORIGIN: '*', // Change to your domain in production
       ENABLE_STORAGE: true, // Set to false to disable Google Sheets
       SHEET_ID: '', // Optional: Your Google Sheet ID
       SHEET_NAME: 'Contact Submissions'
     };
     ```

5. **Save Project**
   - Press `Ctrl+S` or click the save icon
   - Give your project a name

6. **Deploy as Web App**
   - Click "Deploy" → "New deployment"
   - Choose "Web app" as the type
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"

7. **Copy Web App URL**
   - Copy the generated URL (it will look like: `https://script.google.com/macros/s/...`)
   - This is your backend endpoint

### Step 2: Configure Your Portfolio Website

1. **Update JavaScript**
   - Open `js/index.js`
   - Find the line: `const BACKEND_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
   - Replace with your actual web app URL

2. **Test the Form**
   - Open your portfolio website
   - Try submitting the contact form
   - Check your email for notifications

## 🔧 Advanced Configuration

### Google Sheets Storage (Optional)

If you want to store submissions in Google Sheets:

1. **Create a Google Sheet**
   - Go to https://sheets.google.com/
   - Create a new spreadsheet
   - Copy the Sheet ID from the URL

2. **Update Configuration**
   ```javascript
   const CONFIG = {
     // ... other settings
     ENABLE_STORAGE: true,
     SHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', // Your Sheet ID
     SHEET_NAME: 'Contact Submissions'
   };
   ```

3. **Share Sheet**
   - Right-click the sheet tab
   - Share with your Google account
   - Give "Editor" permissions

### CORS Configuration

For production, restrict access to your domain:

```javascript
const CONFIG = {
  // ... other settings
  ALLOW_ORIGIN: 'https://yourdomain.com' // Replace with your actual domain
};
```

## 📱 Mobile Experience

The form is already optimized for mobile devices with:
- Responsive design
- Touch-friendly input fields
- Proper viewport settings
- Mobile-optimized button sizes

## 🛡️ Security Features

### Spam Protection
- **Honeypot Field**: Hidden field that bots fill out
- **Field Validation**: Server-side validation of all inputs
- **Rate Limiting**: Built into Google Apps Script

### Data Validation
- Required field checking
- Email format validation
- Input length validation
- XSS protection

## 📧 Email Notifications

### Email Format
```
Subject: New Portfolio Message: [Subject] or "New Portfolio Message"
From: Portfolio Contact Form
Reply-To: [Sender's Email]

Content:
Name: [Sender Name]
Email: [Sender Email]
Subject: [Subject]
Message: [Message Body]
```

### Customization
You can modify the email template in the `sendEmailNotification` function.

## 🐛 Troubleshooting

### Common Issues

1. **Form not sending**
   - Check browser console for errors
   - Verify the backend URL is correct
   - Ensure Google Apps Script is deployed

2. **Emails not received**
   - Check spam folder
   - Verify ADMIN_EMAIL is correct
   - Check Google Apps Script logs

3. **CORS errors**
   - Verify ALLOW_ORIGIN setting
   - Check if domain matches exactly

### Testing

1. **Test Backend**
   - Run `testFunction()` in Google Apps Script editor
   - Check execution logs

2. **Test Form**
   - Submit test data
   - Verify email receipt
   - Check Google Sheets (if enabled)

## 📊 Monitoring

### Google Apps Script Logs
- View execution logs in the script editor
- Monitor for errors and performance

### Google Sheets (if enabled)
- Track all submissions
- Export data for analysis
- Monitor form usage

## 🔄 Updates

To update the backend:

1. Modify the script in Google Apps Script editor
2. Save the project
3. Create a new deployment
4. Update the URL in your website

## 📞 Support

If you encounter issues:

1. Check Google Apps Script execution logs
2. Verify all configuration settings
3. Test with simple data first
4. Check browser developer console

## 🎯 Next Steps

After setup:

1. **Test thoroughly** with various inputs
2. **Monitor** for spam and adjust settings
3. **Customize** email templates if needed
4. **Backup** your configuration
5. **Document** any custom changes

---

**Note**: This backend is completely free and runs on Google's infrastructure. There are no hosting costs or server maintenance required.
