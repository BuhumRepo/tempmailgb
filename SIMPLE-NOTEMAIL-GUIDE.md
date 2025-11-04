# 🔥 NoteMail - Simple Guide

## ✅ Super Simple Setup!

NoteMail is just another page in your React app - no complicated setup needed!

---

## 🌐 URLs

| Page | URL | What it does |
|------|-----|--------------|
| **TempMail** | http://localhost:5173 | Main temporary email page |
| **NoteMail Home** | http://localhost:5173/notemail | NoteMail landing page |
| **View Note** | http://localhost:5173/notemail/{id}#{key} | View shared email |

---

## 🚀 How to Start

### **1. Start Backends:**

```bash
# Terminal 1 - TempMail Backend
cd backend
node server.js

# Terminal 2 - NoteMail Backend  
cd backend
node notemail.js
```

### **2. Start Frontend:**

```bash
# Terminal 3 - Frontend
cd frontend
npm run dev
```

**That's it!** Everything runs on http://localhost:5173

---

## 🎯 How to Use

### **Step 1: Get Email**
- Go to: http://localhost:5173
- Email auto-generates
- Click "Send Test Email"

### **Step 2: Share as NoteMail**
- Click email in inbox
- Click purple share button (🔗)
- Link copied!

### **Step 3: Recipient Views**
- Paste link in browser
- Format: `http://localhost:5173/notemail/abc123#key456`
- Email displays
- Note destroys after reading

### **Step 4: Recipient Replies**
- Click "Write a Reply"
- Type message
- Click "Send Reply"

### **Step 5: Get Reply**
- Go back to http://localhost:5173
- See reply in inbox!

---

## 📁 Files

Only 3 files matter:

1. **frontend/src/App.jsx** - TempMail (green theme)
2. **frontend/src/NoteMail.jsx** - NoteMail (purple theme)
3. **frontend/src/main.jsx** - Simple router

---

## 🎨 Pages

### **TempMail (/):**
- Green theme
- Receive emails
- Share button on each email

### **NoteMail (/notemail):**
- Purple/pink theme
- Landing page with features
- View shared notes
- Reply system

---

## ✨ That's It!

No XAMPP needed, no separate websites, just:
- Start 3 terminals
- Everything on localhost:5173
- Simple and clean!

---

**🔥 Share emails that self-destruct!**
