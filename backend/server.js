const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
