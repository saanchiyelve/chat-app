# Deployment Guide: Vercel + Railway

This guide will help you deploy your chat app to Vercel (frontend) and Railway (backend).

## 🚀 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### 1.2 Deploy Backend
1. **Connect Repository:**
   - Click "Deploy from GitHub repo"
   - Select your chat-app repository
   - Choose the main branch

2. **Configure Deployment:**
   - Railway will automatically detect it's a Node.js app
   - Set the following environment variables:
     ```
     NODE_ENV=production
     PORT=3001
     ```

3. **Deploy:**
   - Railway will automatically build and deploy
   - Note the generated URL (e.g., `https://your-app.railway.app`)

### 1.3 Get Railway URL
- Go to your Railway project dashboard
- Copy the deployment URL
- This will be your backend URL

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Create a new project

### 2.2 Configure Environment Variables
1. **Add Environment Variable:**
   - In your Vercel project settings
   - Add environment variable:
     ```
     REACT_APP_SOCKET_URL=https://your-app.railway.app
     ```
   - Replace with your actual Railway URL

### 2.3 Deploy Frontend
1. **Connect Repository:**
   - Import your GitHub repository
   - Vercel will auto-detect React app

2. **Build Settings:**
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically

## 🔧 Step 3: Update Configuration

### 3.1 Update Frontend Config
After getting your Railway URL, update `src/config.js`:

```javascript
const config = {
  development: {
    socketUrl: 'http://localhost:3001'
  },
  production: {
    socketUrl: 'https://your-actual-railway-url.railway.app'
  }
};
```

### 3.2 Redeploy Frontend
- Push changes to GitHub
- Vercel will automatically redeploy

## 🧪 Step 4: Test Deployment

1. **Test Backend:**
   - Visit your Railway URL
   - Should see server running message

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try joining a room and sending messages
   - Test with multiple browser tabs

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check Railway logs for CORS issues
   - Verify the frontend URL is in allowed origins

2. **Connection Issues:**
   - Verify `REACT_APP_SOCKET_URL` is set correctly
   - Check browser console for connection errors

3. **Build Failures:**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`

### Debug Commands:

```bash
# Check Railway logs
railway logs

# Check Vercel deployment
vercel logs

# Test local build
npm run build
```

## 📱 Final URLs

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-app.railway.app`

## 🎉 Success!

Your chat app is now live and accessible worldwide! Share the Vercel URL with friends to start chatting. 