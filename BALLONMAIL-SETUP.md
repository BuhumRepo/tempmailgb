# 🚀 BallonMail SMTP Setup Guide

## ✅ Self-Hosted FREE Unlimited Email Sending

This guide will help you set up BallonMail with your own SMTP server for **FREE unlimited** email sending.

---

## 📋 **What's Been Set Up:**

✅ BallonMail frontend page (`/ballonmail`)
✅ Backend API endpoint (`/api/send-bulk`)
✅ Nodemailer SMTP integration
✅ Works with Cloudflare deployment

---

## 🛠️ **Step 1: Install Dependencies**

```bash
cd backend
npm install
```

This will install `nodemailer` for email sending.

---

## 📧 **Step 2: Choose Your SMTP Provider**

### **Option A: Gmail (Recommended for Testing)** ⭐

**Limits:** 500 emails/day (FREE)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-digit password

3. **Create `.env` file** in `backend/` folder:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
PORT=5000
```

### **Option B: Outlook/Hotmail (Free)** 

**Limits:** 300 emails/day (FREE)

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
PORT=5000
```

### **Option C: Your Own SMTP Server (Unlimited!)** 🎯

If you have your own domain with email hosting:

```bash
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
PORT=5000
```

**Best Options for Self-Hosted:**
- **Mailcow** (Docker-based, easy setup)
- **Mail-in-a-Box** (Ubuntu, automated)
- **iRedMail** (Open source)
- **Postal** (Full email platform)

---

## 🚀 **Step 3: Start Your Backend**

```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
SMTP configured with host: smtp.gmail.com
```

---

## 🔧 **Step 4: Configure Frontend**

Your frontend is already configured! It will automatically connect to:
- **Local Development:** `http://localhost:5000`
- **Production:** Set `VITE_API_URL` environment variable

---

## ⚠️ **Important Notes About Deliverability:**

### **Using Gmail/Outlook:**
✅ Good deliverability (emails won't go to spam)
✅ Easy setup
❌ Daily limits (500 for Gmail, 300 for Outlook)

### **Using Self-Hosted SMTP:**
✅ Unlimited sending
✅ Full control
❌ **CRITICAL:** You MUST set up these DNS records to avoid SPAM:

**Required DNS Records:**

1. **SPF Record:**
```
TXT @ "v=spf1 mx a ip4:YOUR_SERVER_IP ~all"
```

2. **DKIM Record:**
```
TXT default._domainkey "v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY"
```

3. **DMARC Record:**
```
TXT _dmarc "v=DMARC1; p=none; rua=mailto:postmaster@yourdomain.com"
```

4. **Reverse DNS (PTR):**
Your server IP should reverse-lookup to your domain.

---

## 🔥 **Step 5: Test BallonMail**

1. Start your backend: `npm start`
2. Open your frontend: `http://localhost:5173/ballonmail`
3. Add recipient email(s)
4. Enter subject and message
5. Click "Send to All Recipients"
6. Check recipient inboxes!

---

## 🌐 **Deploy with Cloudflare**

Your BallonMail frontend will work with:
- ✅ Cloudflare Pages (static frontend)
- ✅ Your backend on any server
- ✅ Cloudflare Workers (if you want to proxy requests)

**No special Cloudflare configuration needed!**

Just make sure your backend is accessible from the internet.

---

## 📊 **Monitoring & Limits**

### **Gmail Limits:**
- 500 emails/day
- 500 recipients per email
- Resets at midnight PST

### **Outlook Limits:**
- 300 emails/day
- 100 recipients per email

### **Self-Hosted:**
- Unlimited (but watch server resources)
- Monitor your server's email queue
- Check blacklists regularly: https://mxtoolbox.com/blacklists.aspx

---

## 🛡️ **Security Best Practices**

1. **Never commit `.env` file** to Git
2. **Use App Passwords** (not main password) for Gmail
3. **Enable HTTPS** on your backend in production
4. **Rate limit** your API to prevent abuse
5. **Add authentication** before going live

---

## 🎯 **Scaling Tips**

**For High Volume (10,000+ emails/day):**

1. Use **AWS SES** ($0.10 per 1,000 emails)
2. Set up **email queue** (Redis/Bull)
3. Implement **rate limiting**
4. Use **multiple SMTP servers** (load balancing)

---

## 🐛 **Troubleshooting**

### **"Failed to send emails"**
- Check your `.env` file has correct credentials
- Verify SMTP server is reachable
- Check firewall allows port 587

### **Emails going to SPAM**
- Set up SPF, DKIM, DMARC records
- Warm up your IP (send slowly at first)
- Avoid spam trigger words
- Include unsubscribe link

### **"Authentication failed"**
- Gmail: Use App Password, not regular password
- Enable "Less secure app access" (if needed)
- Check 2FA is enabled

---

## ✅ **You're Ready!**

Your BallonMail is now set up with FREE self-hosted SMTP!

**Next Steps:**
1. Test with a few emails
2. Monitor deliverability
3. Set up DNS records (if self-hosted)
4. Add rate limiting before going live
5. Deploy to production!

---

## 📞 **Need Help?**

- Check server logs: `backend/` folder
- Test SMTP connection: `telnet smtp.gmail.com 587`
- Verify DNS records: https://mxtoolbox.com/

---

🎉 **Enjoy FREE unlimited bulk email sending!**
