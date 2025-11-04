# 🚀 NoteMail System - Quick Start Guide

## ✅ Complete System Overview

You now have **TWO separate websites**:

1. **TempMail** - Temporary email service (Green theme)
2. **NoteMail** - Self-destructing email sharing (Purple theme)

---

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **TempMail** | http://localhost:5173 | Main temporary email service |
| **NoteMail Home** | http://localhost/tempmailgb.com/notemail/home.html | NoteMail landing page |
| **NoteMail Viewer** | http://localhost/tempmailgb.com/notemail/view/{id}#{key} | View shared notes |

---

## 🚀 How to Start Everything

### **Step 1: Start XAMPP**
```
1. Open XAMPP Control Panel
2. Start Apache
3. Verify: http://localhost shows XAMPP dashboard
```

### **Step 2: Start Backend Services**

**Terminal 1 - TempMail Backend:**
```bash
cd c:\xampp\htdocs\tempmailgb.com\backend
node server.js
```
✅ Running on: http://localhost:5000

**Terminal 2 - NoteMail Backend:**
```bash
cd c:\xampp\htdocs\tempmailgb.com\backend
node notemail.js
```
✅ Running on: http://localhost:5001

### **Step 3: Start Frontend**

**Terminal 3 - TempMail Frontend:**
```bash
cd c:\xampp\htdocs\tempmailgb.com\frontend
npm run dev
```
✅ Running on: http://localhost:5173

---

## 🎯 Complete User Flow

### **1. User Gets Email in TempMail**

```
1. Open: http://localhost:5173
2. Email auto-generates: abc123@tempmail.com
3. Click "Send Test Email" button
4. Email appears in inbox
```

### **2. User Shares Email as NoteMail**

```
1. Click the email in inbox
2. Email opens in viewer
3. Click purple share button (🔗 icon) at top-right
4. Alert shows: "NoteMail link copied!"
5. Link format: http://localhost/tempmailgb.com/notemail/view/xyz123#key456
```

### **3. Recipient Views NoteMail**

```
1. Paste link in browser
2. Opens: http://localhost/tempmailgb.com/notemail/view/xyz123#key456
3. Sees email content
4. Red warning: "This note has been destroyed"
5. Note cannot be viewed again
```

### **4. Recipient Replies**

```
1. Clicks "Write a Reply" button
2. Fills in message
3. Clicks "Send Reply"
4. Success: "Reply Sent!"
```

### **5. Original User Receives Reply**

```
1. Go back to: http://localhost:5173
2. New email in inbox
3. From: "Anonymous Reply"
4. Subject: "Re: [original subject]"
5. Body: [recipient's message]
```

---

## 📁 Project Structure

```
tempmailgb.com/
│
├── backend/
│   ├── server.js          ← TempMail backend (Port 5000)
│   └── notemail.js        ← NoteMail backend (Port 5001)
│
├── frontend/
│   └── src/
│       ├── App.jsx        ← TempMail UI (React)
│       ├── NoteMail.jsx   ← (Not used - standalone version)
│       └── main.jsx       ← Router
│
└── notemail/              ← STANDALONE WEBSITE
    ├── home.html          ← Landing page
    ├── index.html         ← Note viewer
    ├── .htaccess          ← URL rewriting
    └── README.md          ← Documentation
```

---

## 🎨 Design Differences

| Feature | TempMail | NoteMail |
|---------|----------|----------|
| **Theme** | Green | Purple/Pink |
| **Purpose** | Receive emails | Share emails |
| **Technology** | React (Vite) | Standalone HTML |
| **URL** | localhost:5173 | localhost/tempmailgb.com/notemail/ |
| **Backend** | Port 5000 | Port 5001 |

---

## 🔧 Testing Checklist

### **✅ Test TempMail:**
- [ ] Visit http://localhost:5173
- [ ] Email auto-generates
- [ ] Click "Send Test Email"
- [ ] Email appears in inbox
- [ ] Click email to view
- [ ] Purple share button visible

### **✅ Test NoteMail Creation:**
- [ ] Click purple share button
- [ ] Alert shows "link copied"
- [ ] Link format correct
- [ ] Link includes #key

### **✅ Test NoteMail Viewing:**
- [ ] Paste link in new tab
- [ ] NoteMail page loads
- [ ] Email content displays
- [ ] "Destroyed" warning shows
- [ ] Reply button visible

### **✅ Test Reply System:**
- [ ] Click "Write a Reply"
- [ ] Fill in message
- [ ] Click "Send Reply"
- [ ] Success message shows
- [ ] Go back to TempMail
- [ ] Reply appears in inbox

---

## 🐛 Troubleshooting

### **"Cannot access NoteMail"**
```
✅ Check XAMPP Apache is running
✅ Verify URL: http://localhost/tempmailgb.com/notemail/home.html
✅ Check .htaccess file exists in notemail folder
```

### **"Share button not working"**
```
✅ Check NoteMail backend running (port 5001)
✅ Check browser console for errors
✅ Verify CORS enabled in backend
```

### **"Note not found"**
```
✅ Check link is complete (includes #key)
✅ Note may have been viewed already
✅ Check NoteMail backend is running
```

### **"Reply not received"**
```
✅ Check TempMail backend running (port 5000)
✅ Refresh TempMail inbox
✅ Check email hasn't expired
```

---

## 🌟 Key Features

### **TempMail Features:**
- ✅ Auto-generate temporary emails
- ✅ Receive emails from external sources
- ✅ Share emails as NoteMail
- ✅ Receive replies from NoteMail
- ✅ 1-hour expiration
- ✅ Clean, professional UI

### **NoteMail Features:**
- ✅ Self-destruct after 1 view
- ✅ End-to-end encryption
- ✅ Anonymous reply system
- ✅ 24-hour expiration
- ✅ Beautiful purple/pink UI
- ✅ Standalone website

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER WORKFLOW                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│  TempMail (localhost:5173)                              │
│  - Receive email from external source                   │
│  - Click "Share as NoteMail" button                     │
│  - Link copied to clipboard                             │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│  NoteMail Backend (localhost:5001)                      │
│  - Encrypt email content                                │
│  - Generate unique ID and key                           │
│  - Store encrypted data                                 │
│  - Return shareable link                                │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│  NoteMail Website (localhost/tempmailgb.com/notemail/)  │
│  - Recipient opens link                                 │
│  - View encrypted email                                 │
│  - Note destroys after reading                          │
│  - Option to reply                                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│  TempMail Backend (localhost:5000)                      │
│  - Receive reply from NoteMail                          │
│  - Add to original user's inbox                         │
│  - User sees reply as new email                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Production Deployment

### **For Live Deployment:**

1. **Deploy TempMail Frontend:**
   - Build: `npm run build`
   - Deploy to: Cloudflare Pages, Vercel, Netlify

2. **Deploy Backends:**
   - TempMail: Railway, Render, Heroku
   - NoteMail: Same server or separate

3. **Deploy NoteMail Website:**
   - Upload `notemail/` folder to web server
   - Update API URLs in HTML files
   - Enable SSL (HTTPS)

4. **Update URLs:**
   - In `App.jsx`: Update NoteMail link format
   - In `index.html`: Update API endpoints
   - In `home.html`: Update links

---

## 💡 Tips & Best Practices

### **For Development:**
- Keep all 3 terminals open
- Use `nodemon` for auto-restart
- Check browser console for errors
- Test in incognito mode

### **For Production:**
- Use environment variables for URLs
- Enable HTTPS everywhere
- Add rate limiting
- Set up monitoring
- Regular backups

---

## 🎉 Success Indicators

You know it's working when:

1. ✅ TempMail generates emails
2. ✅ Share button copies NoteMail link
3. ✅ NoteMail link opens in browser
4. ✅ Email content displays correctly
5. ✅ Note destroys after viewing
6. ✅ Reply goes back to TempMail inbox

---

## 📞 Support

If you encounter issues:
1. Check all services are running
2. Verify URLs are correct
3. Check browser console
4. Review backend logs
5. Test with simple email first

---

**🔥 You now have a complete self-destructing email sharing system!**

**TempMail + NoteMail = Secure, Private, Self-Destructing Email Communication** 🚀
