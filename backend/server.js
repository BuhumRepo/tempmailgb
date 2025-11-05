const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// SMTP Configuration
// You can use Gmail, your own SMTP server, or any free SMTP service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com', // Change to your SMTP server
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com', // Your email
    pass: process.env.SMTP_PASS || 'your-app-password' // Your password or app password
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const emails = new Map(); // Map of email addresses to their inbox
const emailExpiry = new Map(); // Map of email addresses to expiry time

// Helper function to generate random email
function generateEmail() {
  const randomStr = Math.random().toString(36).substring(2, 12);
  const domains = [
    'tempmail.com', 
    'quickmail.net', 
    'disposable.email',
    'student.edu',
    'university.edu',
    'college.edu'
  ];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${randomStr}@${domain}`;
}

// Helper function to clean expired emails
function cleanExpiredEmails() {
  const now = Date.now();
  for (const [email, expiry] of emailExpiry.entries()) {
    if (expiry < now) {
      emails.delete(email);
      emailExpiry.delete(email);
    }
  }
}

// Run cleanup every minute
setInterval(cleanExpiredEmails, 60000);

// Routes

// Generate new temporary email
app.post('/api/generate', (req, res) => {
  const email = generateEmail();
  emails.set(email, []);
  // Email expires in 1 hour
  emailExpiry.set(email, Date.now() + 3600000);
  
  res.json({
    success: true,
    email: email,
    expiresIn: 3600000
  });
});

// Get inbox for an email
app.get('/api/inbox/:email', (req, res) => {
  const { email } = req.params;
  
  if (!emails.has(email)) {
    return res.status(404).json({
      success: false,
      message: 'Email not found or expired'
    });
  }
  
  const inbox = emails.get(email);
  res.json({
    success: true,
    emails: inbox
  });
});

// Simulate receiving an email (for demo purposes)
app.post('/api/simulate-receive', (req, res) => {
  const { to, from, subject, body } = req.body;
  
  if (!emails.has(to)) {
    return res.status(404).json({
      success: false,
      message: 'Email address not found'
    });
  }
  
  const newEmail = {
    id: uuidv4(),
    from: from || 'demo@example.com',
    subject: subject || 'Demo Email',
    body: body || 'This is a demo email.',
    timestamp: new Date().toISOString(),
    read: false
  };
  
  emails.get(to).push(newEmail);
  
  res.json({
    success: true,
    message: 'Email received'
  });
});

// Reply endpoint - for NoteMail replies
app.post('/api/reply', (req, res) => {
  const { to, from, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if email exists
  if (!emails.has(to)) {
    return res.status(404).json({ error: 'Recipient email not found or expired' });
  }

  const replyEmail = {
    id: Date.now().toString(),
    from: from || 'Anonymous Reply',
    subject,
    body,
    timestamp: Date.now(),
    read: false,
    isReply: true
  };

  emails.get(to).push(replyEmail);

  res.json({ success: true, email: replyEmail });
});

// Mark email as read
app.put('/api/email/:emailAddress/:emailId/read', (req, res) => {
  const { emailAddress, emailId } = req.params;
  
  if (!emails.has(emailAddress)) {
    return res.status(404).json({
      success: false,
      message: 'Email address not found'
    });
  }
  
  const inbox = emails.get(emailAddress);
  const email = inbox.find(e => e.id === emailId);
  
  if (!email) {
    return res.status(404).json({
      success: false,
      message: 'Email not found'
    });
  }
  
  email.read = true;
  
  res.json({
    success: true,
    message: 'Email marked as read'
  });
});

// Delete email
app.delete('/api/email/:emailAddress/:emailId', (req, res) => {
  const { emailAddress, emailId } = req.params;
  
  if (!emails.has(emailAddress)) {
    return res.status(404).json({
      success: false,
      message: 'Email address not found'
    });
  }
  
  const inbox = emails.get(emailAddress);
  const index = inbox.findIndex(e => e.id === emailId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Email not found'
    });
  }
  
  inbox.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Email deleted'
  });
});

// Bulk email sending endpoint for BallonMail
app.post('/api/send-bulk', async (req, res) => {
  const { recipients, subject, message, fromName } = req.body;

  // Validation
  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Recipients array is required'
    });
  }

  if (!subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Subject and message are required'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = recipients.filter(email => !emailRegex.test(email));
  
  if (invalidEmails.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email addresses found',
      invalidEmails
    });
  }

  try {
    // Send emails in parallel
    const sendPromises = recipients.map(recipient => {
      return transporter.sendMail({
        from: `"${fromName || 'BallonMail'}" <${process.env.SMTP_USER || 'noreply@tempmailgb.com'}>`,
        to: recipient,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h2 style="color: white; margin: 0;">BallonMail<sup style="font-size: 12px;">GB</sup></h2>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <p style="color: #6b7280; font-size: 12px; margin-top: 20px; text-align: center;">
                Sent via BallonMail<sup style="font-size: 10px;">GB</sup> - Bulk Email Service
              </p>
            </div>
          </div>
        `,
        text: message // Plain text fallback
      });
    });

    const results = await Promise.allSettled(sendPromises);
    
    // Count successes and failures
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.json({
      success: true,
      message: `Emails sent to ${successful} recipient(s)`,
      sent: successful,
      failed: failed,
      total: recipients.length
    });

  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send emails',
      details: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SMTP configured with host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
});
