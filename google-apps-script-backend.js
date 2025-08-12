/**
 * Portfolio Contact Form Backend - Google Apps Script (Fixed & Improved)
 *
 * ملاحظات مهمة:
 * - Apps Script مع ContentService لا يسمح بضبط هيدرز CORS مخصّصة أو أكواد حالة HTTP غير 200.
 * - لتجنّب preflight CORS من المتصفّح، أرسل الطلب كـ application/x-www-form-urlencoded أو text/plain.
 * - لو أردت فعلاً هيدرز CORS، استخدم Proxy (Cloud Functions/Run) أو نفس الأصل (HtmlService).
 */

// ===== CONFIGURATION =====
const CONFIG = {
  // بريدك الشخصي لتلقي الإشعارات
  ADMIN_EMAIL: 'mohamedriadhch@gmail.com',

  // CORS (تنبيــــه: لن تُطبّق فعليًا مع ContentService)
  ALLOW_ORIGIN: '*',

  // تخزين Google Sheets (اختياري)
  ENABLE_STORAGE: true,             // ضع false لتعطيل التخزين
  SHEET_ID: '',                     // ضع معرّف الـ Sheet هنا إن أردت التخزين
  SHEET_NAME: 'Contact Submissions',// اسم الشيت/التبويب

  // حقل الهوني-بوت (لإيقاف السبام)
  HONEYPOT_FIELD: 'website'
};

// ===== ENTRY POINTS =====
function doPost(e) {
  try {
    const data = parseRequestData(e);

    // honeypot (ديناميكي حسب الإعدادات)
    const hp = CONFIG.HONEYPOT_FIELD;
    if (data[hp] && String(data[hp]).trim() !== '') {
      // سبام محتمل — نعيد نجاح صوري بدون إفشاء السبب
      return createSuccessResponse();
    }

    const validation = validateRequest(data);
    if (!validation.valid) {
      return createErrorResponse(validation.error, 400);
    }

    const emailSent = sendEmailNotification(validation.cleaned); // استخدم النسخة المنظّفة
    if (!emailSent) {
      return createErrorResponse('Failed to send email notification', 500);
    }

    if (CONFIG.ENABLE_STORAGE && CONFIG.SHEET_ID) {
      // لا نكسر التدفق لو فشل التخزين
      try {
        storeInGoogleSheets(validation.cleaned);
      } catch (err) {
        console.error('Failed to store in Google Sheets:', err);
      }
    }

    return createSuccessResponse();
  } catch (err) {
    console.error('Error processing contact form:', err);
    return createErrorResponse('Internal server error', 500);
  }
}

// اختياري: صحّة/اختبار GET (يفيد في الفحص السريع من المتصفح)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Service is up' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== REQUEST PARSING =====
function parseRequestData(e) {
  const out = {};

  if (!e || !e.postData) return out;

  const type = (e.postData.type || '').toLowerCase();
  const body = e.postData.contents || '';

  // 1) JSON (application/json أو text/plain على شكل JSON)
  if (type.includes('application/json') || (type.includes('text/plain') && looksLikeJson(body))) {
    try {
      const obj = JSON.parse(body);
      Object.assign(out, obj);
      return out;
    } catch (err) {
      throw new Error('Invalid JSON data');
    }
  }

  // 2) x-www-form-urlencoded (أو أي فورم بارامز)
  if (e.parameter) {
    Object.keys(e.parameter).forEach(k => { out[k] = e.parameter[k]; });
  }

  return out;
}

function looksLikeJson(s) {
  const t = String(s).trim();
  return (t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'));
}

// ===== VALIDATION =====
function validateRequest(data) {
  const cleaned = {
    name: trimSafe(data.name),
    email: trimSafe(data.email),
    subject: trimSafe(data.subject),
    message: trimSafe(data.message)
  };

  const required = ['name', 'email', 'subject', 'message'];
  for (const f of required) {
    if (!cleaned[f]) {
      return { valid: false, error: `Missing required field: ${f}` };
    }
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned.email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Lengths
  if (cleaned.name.length < 2) return { valid: false, error: 'Name must be at least 2 characters long' };
  if (cleaned.subject.length < 5) return { valid: false, error: 'Subject must be at least 5 characters long' };
  if (cleaned.message.length < 10) return { valid: false, error: 'Message must be at least 10 characters long' };

  return { valid: true, cleaned };
}

function trimSafe(v) {
  return (v == null) ? '' : String(v).trim();
}

// ===== EMAIL NOTIFICATION =====
function sendEmailNotification(data) {
  try {
    const subject = data.subject
      ? `New Portfolio Message: ${data.subject}`
      : 'New Portfolio Message';

    const textBody = [
      'New contact form submission from your portfolio website:',
      '',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Subject: ${data.subject}`,
      '',
      'Message:',
      data.message,
      '',
      '---',
      'This message was sent from your portfolio contact form.',
      'Reply directly to this email to respond to the sender.'
    ].join('\n');

    GmailApp.sendEmail(
      CONFIG.ADMIN_EMAIL,
      subject,
      textBody,
      {
        replyTo: data.email,
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
  if (!CONFIG.SHEET_ID) return false;

  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.getRange(1, 1, 1, 6).setValues([[
      'Timestamp', 'Name', 'Email', 'Subject', 'Message', 'Source IP'
    ]]);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    sheet.getRange(1, 1, 1, 6).setBackground('#f0f0f0');
  }

  const timestamp = new Date();
  const row = [
    timestamp,
    data.name,
    data.email,
    data.subject,
    data.message,
    // ملاحظة: لا توجد طريقة موثوقة للحصول على IP مباشرة من Apps Script Web App.
    '' // مكان احتياطي لـ IP أو أي ميتاداتا إضافية
  ];

  sheet.appendRow(row);
  sheet.autoResizeColumns(1, 6);
  return true;
}

// ===== RESPONSE HELPERS =====
function createSuccessResponse() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(error, statusCode) {
  // تنبيه: لن نستطيع فعليًا ضبط statusCode مع ContentService
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: String(error), statusCode: statusCode || 400 }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== TEST UTIL =====
function testFunction() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Hello from GAS',
    message: 'This is a test message from the Google Apps Script backend.',
    [CONFIG.HONEYPOT_FIELD]: '' // honeypot فارغ
  };

  const valid = validateRequest(testData);
  if (!valid.valid) {
    console.log('Validation failed:', valid.error);
    return;
  }

  const sent = sendEmailNotification(valid.cleaned);
  console.log('Email sent?', sent);

  if (CONFIG.ENABLE_STORAGE && CONFIG.SHEET_ID) {
    const stored = storeInGoogleSheets(valid.cleaned);
    console.log('Stored in sheet?', stored);
  }
}
