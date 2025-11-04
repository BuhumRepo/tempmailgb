/**
 * NoteMail Backend - Self-Destructing Email Sharing
 * Share emails as secure, one-time-view notes
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for notes (use database in production)
const notes = new Map();

// Cleanup expired notes every minute
setInterval(() => {
  const now = Date.now();
  for (const [id, note] of notes.entries()) {
    if (note.expiresAt && note.expiresAt < now) {
      notes.delete(id);
      console.log(`Deleted expired note: ${id}`);
    }
  }
}, 60000);

/**
 * Generate secure random ID for note
 */
function generateNoteId() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Generate encryption key
 */
function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Encrypt note content
 */
function encryptContent(content, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(JSON.stringify(content), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    encrypted,
    iv: iv.toString('hex')
  };
}

/**
 * Decrypt note content
 */
function decryptContent(encrypted, key, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

/**
 * POST /api/notemail/create
 * Create a new self-destructing note from email
 */
app.post('/api/notemail/create', (req, res) => {
  try {
    const { email, options = {} } = req.body;

    if (!email || !email.from || !email.subject || !email.body) {
      return res.status(400).json({ error: 'Invalid email data' });
    }

    // Generate unique ID and encryption key
    const noteId = generateNoteId();
    const encryptionKey = generateEncryptionKey();

    // Prepare note data
    const noteData = {
      from: email.from,
      to: email.to || 'Unknown',
      subject: email.subject,
      body: email.body,
      timestamp: email.timestamp || Date.now(),
      attachments: email.attachments || []
    };

    // Encrypt the content
    const { encrypted, iv } = encryptContent(noteData, encryptionKey);

    // Calculate expiration
    let expiresAt = null;
    if (options.expiresIn) {
      expiresAt = Date.now() + options.expiresIn;
    }

    // Store encrypted note
    notes.set(noteId, {
      encrypted,
      iv,
      createdAt: Date.now(),
      expiresAt,
      viewCount: 0,
      maxViews: options.maxViews || 1, // Default: destroy after 1 view
      requirePassword: options.requirePassword || false,
      password: options.password ? crypto.createHash('sha256').update(options.password).digest('hex') : null,
      notifyOnRead: options.notifyOnRead || false,
      notifyEmail: options.notifyEmail || null,
      ipRestriction: options.ipRestriction || null,
      metadata: {
        userAgent: req.headers['user-agent'],
        createdBy: req.ip
      }
    });

    // Generate shareable link (key is in URL fragment, never sent to server)
    const shareLink = `${req.protocol}://${req.get('host')}/notemail/${noteId}#${encryptionKey}`;

    res.json({
      success: true,
      noteId,
      shareLink,
      expiresAt,
      maxViews: options.maxViews || 1
    });

  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

/**
 * POST /api/notemail/view/:id
 * View a note (requires encryption key from client)
 */
app.post('/api/notemail/view/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { key, password } = req.body;

    const note = notes.get(id);

    if (!note) {
      return res.status(404).json({ 
        error: 'Note not found',
        message: 'This note has already been read and destroyed, or never existed.'
      });
    }

    // Check if expired
    if (note.expiresAt && note.expiresAt < Date.now()) {
      notes.delete(id);
      return res.status(410).json({ 
        error: 'Note expired',
        message: 'This note has expired and been destroyed.'
      });
    }

    // Check password if required
    if (note.requirePassword) {
      if (!password) {
        return res.status(401).json({ 
          error: 'Password required',
          requirePassword: true
        });
      }
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      if (hashedPassword !== note.password) {
        return res.status(403).json({ 
          error: 'Invalid password',
          requirePassword: true
        });
      }
    }

    // Check IP restriction
    if (note.ipRestriction && note.ipRestriction !== req.ip) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'This note can only be viewed from a specific IP address.'
      });
    }

    // Decrypt content
    let content;
    try {
      content = decryptContent(note.encrypted, key, note.iv);
    } catch (error) {
      return res.status(400).json({ 
        error: 'Invalid encryption key',
        message: 'The link appears to be corrupted or incomplete.'
      });
    }

    // Increment view count
    note.viewCount++;

    // Check if should be destroyed
    const shouldDestroy = note.viewCount >= note.maxViews;

    // Prepare response
    const response = {
      success: true,
      content,
      metadata: {
        createdAt: note.createdAt,
        viewCount: note.viewCount,
        maxViews: note.maxViews,
        willDestroy: shouldDestroy,
        viewsRemaining: note.maxViews - note.viewCount
      }
    };

    // Destroy note if max views reached
    if (shouldDestroy) {
      notes.delete(id);
      console.log(`Note ${id} destroyed after ${note.viewCount} views`);
      
      // TODO: Send notification if enabled
      if (note.notifyOnRead && note.notifyEmail) {
        console.log(`Notification would be sent to: ${note.notifyEmail}`);
      }
    }

    res.json(response);

  } catch (error) {
    console.error('View note error:', error);
    res.status(500).json({ error: 'Failed to view note' });
  }
});

/**
 * GET /api/notemail/check/:id
 * Check if note exists without viewing it
 */
app.get('/api/notemail/check/:id', (req, res) => {
  const { id } = req.params;
  const note = notes.get(id);

  if (!note) {
    return res.json({ exists: false });
  }

  // Check if expired
  if (note.expiresAt && note.expiresAt < Date.now()) {
    notes.delete(id);
    return res.json({ exists: false, expired: true });
  }

  res.json({
    exists: true,
    requirePassword: note.requirePassword,
    expiresAt: note.expiresAt,
    viewsRemaining: note.maxViews - note.viewCount,
    createdAt: note.createdAt
  });
});

/**
 * GET /api/notemail/stats
 * Get system statistics
 */
app.get('/api/notemail/stats', (req, res) => {
  res.json({
    totalNotes: notes.size,
    activeNotes: Array.from(notes.values()).filter(n => !n.expiresAt || n.expiresAt > Date.now()).length
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`NoteMail backend running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/notemail`);
});

module.exports = app;
