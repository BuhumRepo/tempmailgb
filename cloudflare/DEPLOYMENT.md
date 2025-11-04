# 🚀 Cloudflare Workers + D1 Deployment Guide

Complete guide to deploy your TempMail backend to Cloudflare Workers with D1 database.

---

## 📋 Prerequisites

1. **Cloudflare Account** (free tier works)
2. **Node.js** installed (v16 or higher)
3. **npm** or **yarn** package manager

---

## 🔧 Step-by-Step Deployment

### **Step 1: Install Wrangler CLI**

```bash
# Install globally
npm install -g wrangler

# Or use npx (no global install)
npx wrangler --version
```

### **Step 2: Login to Cloudflare**

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

### **Step 3: Create D1 Database**

```bash
cd cloudflare
wrangler d1 create tempmail-db
```

**Output will look like:**
```
✅ Successfully created DB 'tempmail-db'

[[d1_databases]]
binding = "DB"
database_name = "tempmail-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**IMPORTANT:** Copy the `database_id` from the output!

### **Step 4: Update wrangler.toml**

Open `wrangler.toml` and replace `YOUR_DATABASE_ID_HERE` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "tempmail-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Your actual ID
```

### **Step 5: Run Database Migrations**

```bash
# Create tables in production database
wrangler d1 execute tempmail-db --file=./schema.sql
```

**Verify tables were created:**
```bash
wrangler d1 execute tempmail-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### **Step 6: Test Locally (Optional)**

```bash
# Create local database for testing
wrangler d1 execute tempmail-db --local --file=./schema.sql

# Run worker locally
wrangler dev
```

Visit: http://localhost:8787

### **Step 7: Deploy to Cloudflare**

```bash
wrangler deploy
```

**Output:**
```
✨ Built successfully!
✨ Uploaded successfully!
✨ Deployed to https://tempmail-worker.YOUR-SUBDOMAIN.workers.dev
```

**Copy your Worker URL!**

---

## 🔄 Update Frontend API URL

### **Step 8: Update React Frontend**

Open `frontend/src/App.jsx` and change the API URL:

```javascript
// OLD (local backend)
const API_URL = 'http://localhost:5000/api';

// NEW (Cloudflare Worker)
const API_URL = 'https://tempmail-worker.YOUR-SUBDOMAIN.workers.dev/api';
```

### **Step 9: Deploy Frontend to Cloudflare Pages**

```bash
cd ../frontend

# Build frontend
npm run build

# Deploy to Cloudflare Pages (first time)
npx wrangler pages deploy dist --project-name=tempmail-frontend
```

**Or use Cloudflare Dashboard:**
1. Go to https://dash.cloudflare.com
2. Click "Pages" → "Create a project"
3. Connect your GitHub repo
4. Set build command: `npm run build`
5. Set build output: `dist`
6. Deploy!

---

## ✅ Testing Your Deployment

### **Test Backend API:**

```bash
# Generate email
curl -X POST https://tempmail-worker.YOUR-SUBDOMAIN.workers.dev/api/generate

# Get inbox
curl https://tempmail-worker.YOUR-SUBDOMAIN.workers.dev/api/inbox/test@tempmail.com

# Simulate email
curl -X POST https://tempmail-worker.YOUR-SUBDOMAIN.workers.dev/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@tempmail.com"}'
```

### **Test Frontend:**

Visit: https://tempmail-frontend.pages.dev

---

## 🔍 Monitoring & Debugging

### **View Worker Logs:**

```bash
wrangler tail
```

### **Query D1 Database:**

```bash
# List all emails
wrangler d1 execute tempmail-db --command="SELECT * FROM emails LIMIT 10"

# List all inbox messages
wrangler d1 execute tempmail-db --command="SELECT * FROM inbox LIMIT 10"

# Count total emails
wrangler d1 execute tempmail-db --command="SELECT COUNT(*) as total FROM emails"
```

### **Check Worker Analytics:**

Visit: https://dash.cloudflare.com → Workers & Pages → Your Worker → Analytics

---

## 🛠️ Common Commands

```bash
# Deploy updates
wrangler deploy

# View logs in real-time
wrangler tail

# Run locally
wrangler dev

# Delete worker
wrangler delete

# List D1 databases
wrangler d1 list

# Backup database
wrangler d1 export tempmail-db --output=backup.sql
```

---

## 💰 Cost Estimate

### **Free Tier Limits:**
- **Workers:** 100,000 requests/day
- **D1 Reads:** 5,000,000/day
- **D1 Writes:** 100,000/day
- **Pages:** Unlimited static requests

### **Paid Tier ($5/month):**
- **Workers:** 10,000,000 requests/month
- **D1 Reads:** 25,000,000/month
- **D1 Writes:** 50,000,000/month

**For most small-medium sites, FREE TIER is enough!**

---

## 🐛 Troubleshooting

### **Error: "Database not found"**
- Make sure you updated `database_id` in `wrangler.toml`
- Run migrations: `wrangler d1 execute tempmail-db --file=./schema.sql`

### **Error: "CORS policy"**
- Check that CORS headers are set in worker.js
- Make sure you're using the correct Worker URL in frontend

### **Error: "Module not found"**
- Run `npm install` in cloudflare directory
- Make sure wrangler.toml is configured correctly

### **Emails not appearing:**
- Check Worker logs: `wrangler tail`
- Query database: `wrangler d1 execute tempmail-db --command="SELECT * FROM inbox"`
- Test API directly with curl

---

## 🎯 Next Steps

1. ✅ **Custom Domain:** Add your own domain in Cloudflare dashboard
2. ✅ **Rate Limiting:** Add rate limiting to prevent abuse
3. ✅ **Analytics:** Set up Cloudflare Analytics
4. ✅ **Monitoring:** Set up alerts for errors
5. ✅ **Backup:** Schedule regular D1 database backups

---

## 📚 Useful Links

- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
- **D1 Database Docs:** https://developers.cloudflare.com/d1/
- **Wrangler CLI Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/

---

## 🆘 Need Help?

- **Cloudflare Discord:** https://discord.gg/cloudflaredev
- **Cloudflare Community:** https://community.cloudflare.com/
- **GitHub Issues:** Create an issue in your repo

---

**🎉 Congratulations! Your TempMail service is now running on Cloudflare's global network!**
