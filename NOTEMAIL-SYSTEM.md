# 🔥 NoteMail System - Complete Guide

## 📖 Overview

NoteMail is an integrated self-destructing email sharing system that works with TempMail. It allows users to share received emails as secure, one-time-view notes with reply functionality.

---

## 🎯 How It Works

### **Complete User Flow:**

```
1. USER receives email in TempMail inbox
   ↓
2. USER clicks "Share as NoteMail" button
   ↓
3. System creates encrypted, self-destructing note
   ↓
4. USER copies and shares the NoteMail link
   ↓
5. RECIPIENT opens link and views email
   ↓
6. Note DESTROYS itself after being read
   ↓
7. RECIPIENT can write a reply
   ↓
8. Reply is sent back to USER's TempMail inbox
   ↓
9. USER receives reply as new email
```

---

## 🔄 System Architecture

### **Components:**

1. **TempMail** (Port 5000)
   - Generates temporary email addresses
   - Receives emails from external sources
   - Displays inbox with emails
   - Has "Share as NoteMail" button on each email

2. **NoteMail Backend** (Port 5001)
   - Creates encrypted notes from emails
   - Stores encrypted data temporarily
   - Handles note viewing and destruction
   - Manages reply routing

3. **Frontend** (Port 5173)
   - TempMail UI at `/`
   - NoteMail UI at `/notemail/{id}#{key}`
   - Automatic routing based on URL

---

## 💡 Key Features

### **For Email Sender (TempMail User):**
- ✅ Receive emails in temporary inbox
- ✅ Share any email as self-destructing note
- ✅ One-click copy NoteMail link
- ✅ Receive replies back in inbox
- ✅ Track when note is viewed (coming soon)

### **For Note Recipient:**
- ✅ View email in clean, secure interface
- ✅ Note destroys after single view
- ✅ Reply back to sender anonymously
- ✅ No registration required
- ✅ End-to-end encrypted

---

## 🚀 Quick Start

### **1. Start All Services:**

```bash
# Double-click this file:
start-notemail.bat

# Or manually:
# Terminal 1
cd backend && node server.js

# Terminal 2
cd backend && node notemail.js

# Terminal 3
cd frontend && npm run dev
```

### **2. Access the System:**

- **TempMail:** http://localhost:5173
- **NoteMail:** http://localhost:5173/notemail/...

---

## 📸 Usage Example

### **Step 1: Receive Email in TempMail**

```
User visits: http://localhost:5173
Email auto-generates: abc123@tempmail.com
User receives email from: demo@example.com
Subject: "Welcome to Our Service!"
```

### **Step 2: Share as NoteMail**

```
1. User clicks email in inbox
2. Email opens in viewer
3. User clicks purple "Share" button (🔗 icon)
4. NoteMail link copied to clipboard
5. Alert shows: "NoteMail link copied!"
```

### **Step 3: Recipient Views Note**

```
Recipient opens link:
http://localhost:5173/notemail/abc123def456#key789xyz

Sees:
┌─────────────────────────────────────┐
│ 🔥 NoteMail                         │
├─────────────────────────────────────┤
│ Subject: Welcome to Our Service!    │
│ From: demo@example.com              │
│ To: abc123@tempmail.com             │
│ Date: 11/1/2025, 10:27:01 PM       │
├─────────────────────────────────────┤
│ This is a demo email...             │
│                                     │
│ [Want to reply? Write a Reply]      │
└─────────────────────────────────────┘

⚠️ This note has been destroyed
```

### **Step 4: Recipient Replies**

```
1. Recipient clicks "Write a Reply"
2. Fills in message
3. Clicks "Send Reply"
4. Reply sent to: abc123@tempmail.com
```

### **Step 5: Original User Receives Reply**

```
User's TempMail inbox shows new email:
From: Anonymous Reply
Subject: Re: Welcome to Our Service!
Body: [Recipient's message]
```

---

## 🔐 Security Features

### **Encryption:**
- **Algorithm:** AES-256-CBC
- **Key Location:** URL fragment (never sent to server)
- **Zero Knowledge:** Server cannot decrypt notes

### **Self-Destruct:**
- **Default:** Destroy after 1 view
- **Time Limit:** 24 hours maximum
- **Automatic:** No manual deletion needed

### **Privacy:**
- **Anonymous Replies:** No email addresses exposed
- **No Tracking:** No analytics on note views
- **No Storage:** Notes deleted immediately after viewing

---

## 🎨 UI Design

### **TempMail (Green Theme):**
- Clean, professional Shopify-style
- White cards with subtle shadows
- Green primary color (#16a34a)
- Clear email list and viewer

### **NoteMail (Purple/Pink Theme):**
- Gradient purple-to-pink design
- Flame icon for self-destruct
- Warning messages before viewing
- Reply interface integrated

---

## 📡 API Endpoints

### **TempMail API (Port 5000):**

```javascript
// Generate email
POST /api/generate
Response: { email, expiresIn }

// Get inbox
GET /api/inbox/:email
Response: [emails...]

// Receive reply from NoteMail
POST /api/reply
Body: { to, from, subject, body }
Response: { success, email }
```

### **NoteMail API (Port 5001):**

```javascript
// Create note from email
POST /api/notemail/create
Body: {
  email: { from, to, subject, body, replyTo },
  options: { maxViews, expiresIn }
}
Response: { noteId, shareLink }

// View note
POST /api/notemail/view/:id
Body: { key }
Response: { content, metadata }
```

---

## 🔄 Data Flow

### **Creating NoteMail:**

```
TempMail Frontend
    ↓ (Click Share button)
POST /api/notemail/create
    ↓
NoteMail Backend
    ├─ Generate encryption key
    ├─ Encrypt email content
    ├─ Store encrypted data
    └─ Return share link
    ↓
TempMail Frontend
    └─ Copy link to clipboard
```

### **Viewing NoteMail:**

```
Recipient opens link
    ↓
NoteMail Frontend
    ├─ Extract ID from URL path
    ├─ Extract key from URL hash (#)
    └─ POST /api/notemail/view/:id
    ↓
NoteMail Backend
    ├─ Retrieve encrypted data
    ├─ Return encrypted data
    └─ Delete note (self-destruct)
    ↓
NoteMail Frontend
    ├─ Decrypt with key from URL
    └─ Display email content
```

### **Sending Reply:**

```
Recipient writes reply
    ↓
NoteMail Frontend
    └─ POST /api/reply
    ↓
TempMail Backend
    ├─ Validate recipient email exists
    ├─ Create reply email
    └─ Add to inbox
    ↓
Original User
    └─ Sees reply in TempMail inbox
```

---

## 🛠️ Configuration

### **NoteMail Settings:**

```javascript
// In TempMail App.jsx
const shareAsNoteMail = async (email) => {
  // Customize these options:
  options: {
    maxViews: 1,           // 1, 2, 5, or 10
    expiresIn: 86400000    // 24 hours in ms
  }
};
```

### **Reply Settings:**

```javascript
// In NoteMail Backend
const replyEmail = {
  from: 'Anonymous Reply',  // Customize sender name
  isReply: true             // Flag for styling
};
```

---

## 🎯 Use Cases

### **Personal:**
- Share sensitive emails securely
- Forward emails without forwarding
- Get replies without exposing email
- Temporary email conversations

### **Business:**
- Share customer emails with team
- Send confidential information
- Temporary client communication
- Secure document sharing

### **Development:**
- Share test emails
- Debug email issues
- Temporary API responses
- Testing email flows

---

## 🚧 Roadmap

### **Phase 1: Core** ✅
- [x] Email sharing as notes
- [x] Self-destruct after view
- [x] Reply functionality
- [x] End-to-end encryption

### **Phase 2: Enhanced** 🚧
- [ ] Read notifications
- [ ] Multiple view options in UI
- [ ] Custom expiration times
- [ ] Password protection
- [ ] File attachments

### **Phase 3: Advanced** 📋
- [ ] Email threading
- [ ] Note analytics
- [ ] Custom domains
- [ ] API access
- [ ] Webhooks

---

## 🐛 Troubleshooting

### **"Share button not working"**
- Check NoteMail backend is running on port 5001
- Check browser console for errors
- Verify CORS is enabled

### **"Note not found"**
- Note may have been viewed and destroyed
- Check if link is complete (includes #key)
- Note may have expired (24 hour limit)

### **"Reply not received"**
- Original TempMail may have expired
- Check TempMail backend is running
- Refresh inbox to see new emails

### **"Cannot decrypt note"**
- Link may be corrupted
- Make sure full URL is copied (including #)
- Try generating new NoteMail

---

## 📊 Comparison

| Feature | Regular Email Forward | NoteMail |
|---------|----------------------|----------|
| **Privacy** | Exposes addresses | Anonymous |
| **Security** | Plain text | Encrypted |
| **Persistence** | Permanent | Self-destructs |
| **Reply** | Direct | Through TempMail |
| **Tracking** | Full headers | Zero knowledge |

---

## 🔒 Best Practices

### **For Senders:**
1. Only share sensitive emails via NoteMail
2. Verify link is copied completely
3. Inform recipient note will self-destruct
4. Check inbox for replies regularly

### **For Recipients:**
1. View notes immediately
2. Save important information before viewing
3. Use reply feature for responses
4. Don't try to view note twice

---

## 📝 Technical Details

### **File Structure:**

```
tempmailgb.com/
├── backend/
│   ├── server.js          # TempMail backend
│   └── notemail.js        # NoteMail backend
├── frontend/
│   └── src/
│       ├── App.jsx        # TempMail UI
│       ├── NoteMail.jsx   # NoteMail UI
│       └── main.jsx       # Router
└── start-notemail.bat     # Quick start script
```

### **Dependencies:**

```json
{
  "backend": ["express", "cors", "crypto"],
  "frontend": ["react", "axios", "lucide-react", "tailwindcss"]
}
```

---

## 🎉 Summary

NoteMail is a complete email sharing system that:

1. ✅ Integrates with TempMail
2. ✅ Creates self-destructing notes
3. ✅ Enables anonymous replies
4. ✅ Maintains privacy and security
5. ✅ Works seamlessly end-to-end

**Perfect for sharing sensitive emails that should only be read once!** 🔥

---

## 🆘 Support

For issues or questions:
- Check this documentation
- Review API endpoints
- Test with demo emails
- Check browser console

---

**Built with ❤️ for secure, private email sharing**
