# WishperWall - Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Project Configuration Complete
- ✅ `vercel.json` - Vercel configuration file
- ✅ `api/index.js` - Serverless function handler
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ `vite.config.js` - Updated with correct base path
- ✅ `server.js` - Configured for both local and production environments
- ✅ `axios.js` - Configured to use correct API endpoints

---

## 🚀 Deployment Steps

### Step 1: Push Your Code to GitHub
```bash
git add .
git commit -m "Configure project for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Your Project**
   - Click "Add New" → "Project"
   - Select your `WishperWall` repository
   - Click "Import"

### Step 3: Configure Project Settings

1. **Framework Preset**: Select "Other" (or leave as detected)

2. **Root Directory**: Leave as `.` (root)

3. **Build Command**: 
   ```
   npm run build
   ```

4. **Output Directory**: 
   ```
   frontend/dist
   ```

5. **Install Command**: 
   ```
   npm install
   ```

### Step 4: Add Environment Variables

Click on "Environment Variables" and add the following:

| Name | Value | Notes |
|------|-------|-------|
| `NODE_ENV` | `production` | Set environment to production |
| `MONGO_URI` | `your_mongodb_connection_string` | Your MongoDB Atlas connection string |
| `UPSTASH_REDIS_REST_URL` | `your_upstash_url` | From Upstash Redis dashboard |
| `UPSTASH_REDIS_REST_TOKEN` | `your_upstash_token` | From Upstash Redis dashboard |
| `PORT` | `3000` | Optional (Vercel sets this automatically) |

**Important:** Make sure to get these values from:
- MongoDB: [MongoDB Atlas](https://cloud.mongodb.com)
- Upstash: [Upstash Console](https://console.upstash.com)

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like: `https://wishperwall.vercel.app`

---

## 🔧 Post-Deployment Configuration

### MongoDB Atlas Setup

1. **Whitelist Vercel IPs**
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Add `0.0.0.0/0` to allow all IPs (Vercel uses dynamic IPs)
   - Or add specific Vercel IP ranges

2. **Test Database Connection**
   - Visit your deployed site
   - Try creating a note
   - If it fails, check the Vercel logs

### Upstash Redis Setup

1. **Verify Configuration**
   - Ensure your Upstash Redis REST URL and token are correct
   - These should work automatically with Vercel

---

## 🧪 Testing Your Deployment

1. **Visit Your Site**
   - Open the Vercel URL
   - Navigate through all pages

2. **Test All Features**
   - ✅ Create a new note
   - ✅ View note details
   - ✅ Delete a note
   - ✅ Check rate limiting (try creating many notes quickly)

3. **Check Logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on your deployment → "Functions" tab
   - Check for any errors

---

## 📝 Important Notes

### API Routes
- All API routes are prefixed with `/api`
- Example: `https://your-domain.vercel.app/api/notes`

### Database Connection
- The database connection is established on the first API call
- Subsequent calls reuse the existing connection
- This is handled in `api/index.js`

### Rate Limiting
- Upstash Redis is used for rate limiting
- Make sure your environment variables are set correctly

### Static Files
- Frontend is served from `frontend/dist`
- All routes fallback to `index.html` for React Router

---

## 🐛 Troubleshooting

### Build Fails
- Check the build logs in Vercel
- Ensure all dependencies are in `package.json`
- Verify the build command is correct

### API Not Working
- Check environment variables are set
- Verify MongoDB connection string
- Check Vercel function logs

### 404 Errors
- Ensure `vercel.json` rewrites are configured
- Check that `base` in `vite.config.js` is set to `"/"`

### Database Connection Issues
- Whitelist `0.0.0.0/0` in MongoDB Atlas
- Verify `MONGO_URI` is correct
- Check Vercel function logs for connection errors

---

## 🔄 Redeployment

### Automatic Deployment
Every time you push to the `main` branch, Vercel will automatically:
1. Pull the latest code
2. Run the build
3. Deploy the new version

### Manual Deployment
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" → "Redeploy"

---

## 📊 Monitoring

### View Logs
1. Go to Vercel Dashboard
2. Click on your project
3. Navigate to "Deployments"
4. Click on a deployment
5. Go to "Functions" tab to see serverless function logs

### Analytics
- Vercel provides built-in analytics
- Go to your project → "Analytics" tab

---

## 🎉 Success!

If everything is working:
- ✅ Your site is live on Vercel
- ✅ API routes are functioning
- ✅ Database connections are working
- ✅ Rate limiting is active

Share your live URL: `https://wishperwall.vercel.app` 🎊

---

## 📞 Need Help?

- Check Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas Support: [mongodb.com/support](https://www.mongodb.com/support)
- Upstash Docs: [upstash.com/docs](https://upstash.com/docs)
