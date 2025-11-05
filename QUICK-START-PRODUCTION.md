# ⚡ BallonMail Production - Quick Start (5 Minutes)

## Fastest way to get BallonMail working in production!

---

## 🚀 **1. Sign Up for Resend** (2 minutes)

1. Go to: **https://resend.com/signup**
2. Create FREE account
3. Verify email

**You get:**
- ✅ 3,000 emails/month FREE
- ✅ 100 emails/day FREE
- ✅ No credit card required

---

## 🔑 **2. Get API Key** (1 minute)

1. In Resend dashboard → **API Keys**
2. Click **Create API Key**
3. Name: `BallonMail`
4. **Copy the key** (starts with `re_...`)

---

## ☁️ **3. Deploy to Cloudflare** (2 minutes)

Open terminal in project folder:

```bash
# Login to Cloudflare (first time only)
wrangler login

# Deploy the worker
cd cloudflare
wrangler deploy --config wrangler-ballonmail.toml

# Set your Resend API key
wrangler secret put RESEND_API_KEY --name ballonmail-api
# Paste your API key when prompted

# Set your from email
wrangler secret put FROM_EMAIL --name ballonmail-api  
# Enter: onboarding@resend.dev (for testing)
# OR: noreply@tempmailgb.com (if domain verified)
```

---

## ✅ **4. You're Done!**

Your BallonMail is LIVE at:
**https://tempmailgb.com/ballonmail**

Test it:
1. Go to your live site
2. Add your email as recipient
3. Send a test email
4. Check your inbox! 📧

---

## 🎯 **Using Test Email (Quick)**

For immediate testing without domain setup:

**From Email:** `onboarding@resend.dev`
**Limitation:** Can only send to verified emails

**To verify your test email:**
1. Resend dashboard → **Audiences**
2. Add your personal email
3. Verify it
4. Now you can receive test emails!

---

## 📧 **For Production Use (Recommended)**

### **Verify Your Domain:**

1. Resend dashboard → **Domains**
2. Add domain: `tempmailgb.com`
3. Add DNS records (shown in dashboard)
4. Wait 10 minutes
5. Click **Verify**

**Then you can send to ANY email address!** ✅

---

## 🔧 **Troubleshooting**

### **"Worker not found"**
```bash
# Make sure you're in cloudflare folder
cd cloudflare
wrangler deploy --config wrangler-ballonmail.toml
```

### **"API key invalid"**
```bash
# Reset the secret
wrangler secret put RESEND_API_KEY --name ballonmail-api
# Paste the correct key
```

### **"Not allowed to send to this email"**
- Using `onboarding@resend.dev`? 
- Recipient must be verified in Resend → Audiences

---

## 📊 **Check Usage**

Monitor your sends:
**https://resend.com/overview**

See:
- Emails sent today
- Monthly usage
- Delivery status
- Error logs

---

## 💰 **Pricing**

**FREE Forever:**
- 3,000 emails/month
- 100 emails/day
- Perfect for most use cases!

**Need More?**
- Pro: $20/month = 50,000 emails
- Business: $85/month = 100,000 emails

---

## 🎉 **That's It!**

You now have:
- ✅ Production-ready BallonMail
- ✅ Sending real emails
- ✅ Free for 3,000 emails/month
- ✅ Running on Cloudflare edge
- ✅ No server to maintain

**Start sending bulk emails now!** 🚀📧

---

## 📖 **Want More Details?**

Read the full guide: **BALLONMAIL-PRODUCTION.md**

Includes:
- Domain verification steps
- Security best practices
- Scaling strategies
- Advanced configuration
- Monitoring setup
