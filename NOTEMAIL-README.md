# 🔥 NoteMail - Self-Destructing Email Sharing

A secure, privacy-focused platform for sharing emails that automatically self-destruct after being read. Like Privnote, but specifically designed for email content with advanced security features.

---

## ✨ Features

### 🔐 **Security Features**
- **End-to-End Encryption** - AES-256-CBC encryption
- **Self-Destruct** - Automatically destroys after being read
- **Password Protection** - Optional password requirement
- **View Limits** - Set maximum number of views (1-10)
- **Time Expiration** - Auto-delete after specified time
- **IP Restriction** - Limit access to specific IP addresses

### 🎯 **Advanced Features**
- **One-Time View** - Default: destroy after single read
- **Multiple Views** - Allow 2, 5, or 10 views before destruction
- **Custom Expiration** - 1 hour, 24 hours, or 7 days
- **Read Notifications** - Get notified when note is read (coming soon)
- **No Server Storage** - Encryption key never reaches server
- **Zero Knowledge** - Server cannot decrypt your notes

### 🚀 **User Experience**
- **Instant Creation** - Create notes in seconds
- **Simple Sharing** - One link to share
- **Mobile Friendly** - Works on all devices
- **No Registration** - Completely anonymous
- **Beautiful UI** - Modern, gradient design

---

## 🏗️ Architecture

### **How It Works:**

1. **Create Note:**
   - User pastes email content
   - Client generates encryption key (32 bytes)
   - Content encrypted in browser with AES-256
   - Encrypted data sent to server
   - Server stores encrypted data + metadata
   - Encryption key added to URL fragment (#key)

2. **Share Link:**
   - Link format: `https://domain.com/notemail/{id}#{key}`
   - ID identifies the note on server
   - Key (after #) never sent to server
   - Only person with full link can decrypt

3. **View Note:**
   - User opens link
   - Client extracts key from URL fragment
   - Requests encrypted data from server
   - Decrypts locally in browser
   - Server increments view count
   - If max views reached, server deletes note

4. **Self-Destruct:**
   - After max views: immediate deletion
   - After expiration time: automatic cleanup
   - No recovery possible

---

## 🔧 Installation & Setup

### **Prerequisites:**
- Node.js v16+
- npm or yarn

### **Backend Setup:**

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install express cors

# Start NoteMail backend
node notemail.js
```

Backend runs on: `http://localhost:5001`

### **Frontend Setup:**

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

### **Access NoteMail:**

- **TempMail:** http://localhost:5173
- **NoteMail:** http://localhost:5173/notemail

---

## 📡 API Endpoints

### **POST /api/notemail/create**
Create a new self-destructing note

**Request:**
```json
{
  "email": {
    "from": "sender@example.com",
    "to": "recipient@example.com",
    "subject": "Important Message",
    "body": "This is the email content",
    "timestamp": 1699999999999
  },
  "options": {
    "maxViews": 1,
    "expiresIn": 3600000,
    "requirePassword": true,
    "password": "secret123",
    "notifyOnRead": false,
    "notifyEmail": "notify@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "noteId": "abc123...",
  "shareLink": "http://localhost:5001/notemail/abc123...#key123...",
  "expiresAt": 1699999999999,
  "maxViews": 1
}
```

### **POST /api/notemail/view/:id**
View a note (requires encryption key)

**Request:**
```json
{
  "key": "encryption-key-from-url",
  "password": "secret123"
}
```

**Response:**
```json
{
  "success": true,
  "content": {
    "from": "sender@example.com",
    "subject": "Important Message",
    "body": "This is the email content",
    "timestamp": 1699999999999
  },
  "metadata": {
    "createdAt": 1699999999999,
    "viewCount": 1,
    "maxViews": 1,
    "willDestroy": true,
    "viewsRemaining": 0
  }
}
```

### **GET /api/notemail/check/:id**
Check if note exists without viewing

**Response:**
```json
{
  "exists": true,
  "requirePassword": true,
  "expiresAt": 1699999999999,
  "viewsRemaining": 1,
  "createdAt": 1699999999999
}
```

---

## 🔐 Security Details

### **Encryption:**
- **Algorithm:** AES-256-CBC
- **Key Size:** 256 bits (32 bytes)
- **IV Size:** 128 bits (16 bytes)
- **Key Generation:** Crypto.randomBytes (cryptographically secure)

### **Key Management:**
- Encryption key generated client-side
- Key stored in URL fragment (after #)
- Fragment never sent to server
- Server only stores encrypted data
- Zero-knowledge architecture

### **Data Storage:**
- Encrypted content
- Initialization vector (IV)
- Metadata (views, expiry, etc.)
- Password hash (SHA-256 if password protected)
- NO plaintext content stored

### **Automatic Cleanup:**
- Expired notes deleted every 60 seconds
- Notes deleted immediately after max views
- No trace left on server

---

## 🎨 UI/UX Features

### **Design:**
- Purple/Pink gradient theme
- Modern, clean interface
- Responsive design
- Smooth animations
- Clear visual feedback

### **User Flow:**
1. **Home Page** - Features and how it works
2. **Create Page** - Paste email, set options
3. **Success Page** - Copy shareable link
4. **View Page** - Enter password (if required), view note
5. **Destroyed** - Confirmation of destruction

### **Security Indicators:**
- 🔥 Flame icon for self-destruct
- 🔒 Lock icon for encryption
- ⚠️ Warning before viewing
- ✅ Confirmation after destruction

---

## 🚀 Deployment

### **Option 1: Same Server as TempMail**

Both apps can run on same server:
- TempMail backend: Port 5000
- NoteMail backend: Port 5001
- Frontend: Serves both apps with routing

### **Option 2: Separate Deployment**

Deploy NoteMail independently:
- Backend: Railway, Render, Heroku
- Frontend: Cloudflare Pages, Vercel, Netlify

### **Environment Variables:**

```env
PORT=5001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

---

## 📊 Use Cases

### **Personal:**
- Share sensitive emails with colleagues
- Send confidential information
- Share verification codes securely
- Forward emails without forwarding

### **Business:**
- Share customer emails with team
- Send contracts or agreements
- Share API keys or credentials
- Temporary access to information

### **Development:**
- Share test emails
- Debug email issues
- Share error logs
- Temporary data sharing

---

## 🔄 Differences from Privnote

| Feature | Privnote | NoteMail |
|---------|----------|----------|
| **Content Type** | Plain text | Email format |
| **Encryption** | Server-side | Client-side E2E |
| **Email Structure** | No | Yes (From, Subject, Body) |
| **View Limits** | 1 only | 1, 2, 5, or 10 |
| **Password** | Optional | Optional |
| **Expiration** | Time-based | Time + View-based |
| **IP Restriction** | No | Yes |
| **Notifications** | No | Coming soon |

---

## 🛣️ Roadmap

### **Phase 1: Core Features** ✅
- [x] End-to-end encryption
- [x] Self-destruct after views
- [x] Password protection
- [x] Time expiration
- [x] Beautiful UI

### **Phase 2: Advanced Features** 🚧
- [ ] Email notifications on read
- [ ] File attachments support
- [ ] Custom domains
- [ ] Analytics dashboard
- [ ] API rate limiting

### **Phase 3: Enterprise** 📋
- [ ] Team accounts
- [ ] Audit logs
- [ ] SSO integration
- [ ] Custom branding
- [ ] SLA guarantees

---

## 🐛 Troubleshooting

### **Note not found:**
- Note may have been viewed and destroyed
- Note may have expired
- Check if link is complete (includes #key)

### **Invalid encryption key:**
- Link may be corrupted
- Make sure full URL is copied (including #)
- Try generating a new note

### **Password not working:**
- Check for typos
- Password is case-sensitive
- Contact note creator for correct password

---

## 📝 Best Practices

### **For Creators:**
1. Use password protection for sensitive content
2. Set appropriate view limits
3. Use short expiration times
4. Don't reuse passwords
5. Verify link before sharing

### **For Recipients:**
1. View notes immediately
2. Save important information before viewing
3. Don't share the link further
4. Be aware note will be destroyed

---

## 🔒 Privacy & Security

- **No logging** - We don't log note contents
- **No tracking** - No analytics on note views
- **No storage** - Notes deleted after use
- **No backdoors** - True end-to-end encryption
- **Open source** - Code is transparent

---

## 📄 License

MIT License - Feel free to use and modify

---

## 🆘 Support

For issues or questions:
- Create GitHub issue
- Check documentation
- Review API examples

---

## 🎉 Credits

Built with:
- React 18
- Express.js
- Node.js Crypto
- TailwindCSS
- Lucide Icons

Inspired by Privnote, but designed specifically for email sharing with enhanced security features.

---

**🔥 NoteMail - Share emails that self-destruct. Secure. Private. Simple.**
