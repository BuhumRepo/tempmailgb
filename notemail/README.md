# 🔥 NoteMail - Standalone Website

## 📍 Access URLs

- **NoteMail Home:** http://localhost/tempmailgb.com/notemail/home.html
- **View Note:** http://localhost/tempmailgb.com/notemail/view/{id}#{key}
- **TempMail:** http://localhost:5173

---

## 🎯 What is NoteMail?

NoteMail is a **separate website** that works with TempMail to share emails as self-destructing notes.

### **How It Works:**

```
TempMail (localhost:5173)
    ↓
User receives email
    ↓
Clicks "Share as NoteMail" button
    ↓
NoteMail link created
    ↓
NoteMail Website (localhost/tempmailgb.com/notemail/)
    ↓
Recipient views email (destroys after reading)
    ↓
Recipient can reply back to TempMail inbox
```

---

## 🚀 Quick Start

### **1. Make sure XAMPP is running:**
- Apache server must be ON
- Access: http://localhost

### **2. Start backends:**
```bash
# Terminal 1 - TempMail Backend
cd backend
node server.js

# Terminal 2 - NoteMail Backend
cd backend
node notemail.js
```

### **3. Start TempMail frontend:**
```bash
# Terminal 3
cd frontend
npm run dev
```

### **4. Access NoteMail:**
- Home: http://localhost/tempmailgb.com/notemail/home.html
- Or click share button from TempMail

---

## 📁 File Structure

```
notemail/
├── home.html          # Landing page
├── index.html         # Note viewer (handles /view/{id})
├── .htaccess          # URL rewriting
└── README.md          # This file
```

---

## 🔗 Integration with TempMail

### **In TempMail inbox:**
1. User receives email
2. Clicks purple share button (🔗)
3. NoteMail link copied
4. Link format: `http://localhost/tempmailgb.com/notemail/view/{id}#{key}`

### **In NoteMail:**
1. Recipient opens link
2. Views email content
3. Note destroys itself
4. Can reply back to sender

---

## 🎨 Design

- **Purple/Pink gradient theme**
- **Completely separate from TempMail**
- **Standalone HTML pages**
- **No React build needed**
- **Works with XAMPP/Apache**

---

## ✅ Features

- ✅ Self-destructing notes
- ✅ End-to-end encryption
- ✅ Anonymous replies
- ✅ Beautiful UI
- ✅ Mobile responsive
- ✅ Standalone website

---

## 🔧 Configuration

### **Update API URLs if needed:**

In `index.html` and `home.html`:
```javascript
const NOTEMAIL_API = 'http://localhost:5001/api/notemail';
const TEMPMAIL_API = 'http://localhost:5000/api';
```

---

## 📱 Usage Example

### **Step 1: User in TempMail**
```
1. Visit: http://localhost:5173
2. Receive email in inbox
3. Click email to view
4. Click purple share button
5. Link copied: http://localhost/tempmailgb.com/notemail/view/abc123#key456
```

### **Step 2: Share Link**
```
Send link to anyone via:
- WhatsApp
- Email
- SMS
- Messenger
```

### **Step 3: Recipient Opens Link**
```
1. Opens: http://localhost/tempmailgb.com/notemail/view/abc123#key456
2. Sees email content
3. Note destroys automatically
4. Can click "Write a Reply"
```

### **Step 4: Reply Received**
```
1. Recipient writes reply
2. Clicks "Send Reply"
3. Reply goes to original TempMail inbox
4. User sees new email
```

---

## 🌐 Deployment

### **For Production:**

1. **Upload notemail folder** to your web server
2. **Update API URLs** to production endpoints
3. **Enable mod_rewrite** in Apache
4. **Set up SSL** for HTTPS

### **Example Production URLs:**
```
NoteMail: https://yourdomain.com/notemail/
TempMail: https://yourdomain.com/
```

---

## 🔐 Security

- **Encryption key in URL fragment** (never sent to server)
- **AES-256-CBC encryption**
- **Zero-knowledge architecture**
- **Automatic destruction**
- **No logging**

---

## 💡 Why Separate Website?

1. **Different branding** - Purple/pink vs green
2. **Different purpose** - Sharing vs receiving
3. **Easier to manage** - Separate codebases
4. **Better SEO** - Different keywords
5. **Cleaner URLs** - /notemail/ vs /tempmail/

---

## 🎯 Next Steps

1. ✅ Test the flow end-to-end
2. ✅ Customize colors/branding
3. ✅ Add custom domain
4. ✅ Deploy to production
5. ✅ Add analytics

---

**🔥 NoteMail - Share emails that self-destruct!**
