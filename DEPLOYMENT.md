# 🚀 Vercel Deployment Guide

This guide will help you deploy your Trustless Work POC to Vercel.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com/signup) (free tier available)
- [GitHub Account](https://github.com) (or GitLab, Bitbucket)
- Your project code pushed to a Git repository

## 🔧 Pre-Deployment Setup

### 1. Update .gitignore
Make sure your `.gitignore` includes:
```gitignore
.env
.env.local
.env.production
.next/
node_modules/
```

### 2. Commit Your Changes
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## 🚀 Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import Git Repository**
   - Connect your GitHub account if not already connected
   - Select your `trustless-poc` repository
   - Click "Import"

4. **Configure Project Settings**
   - **Project Name**: `trustless-work-poc` (or your preferred name)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `.next` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

5. **Environment Variables**
   - Click "Environment Variables" section
   - Add each variable from `env.production`:
   
   ```
   NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
   NEXT_PUBLIC_STELLAR_HORIZON_TESTNET=https://horizon-testnet.stellar.org
   NEXT_PUBLIC_STELLAR_HORIZON_PUBLIC=https://horizon.stellar.org
   NEXT_PUBLIC_APP_NAME=Trustless Work POC
   NEXT_PUBLIC_APP_VERSION=0.1.0
   NEXT_PUBLIC_DEFAULT_ASSET_CODE=USDC
   NEXT_PUBLIC_DEFAULT_ASSET_ISSUER=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA
   NEXT_PUBLIC_PLATFORM_FEE_PERCENTAGE=4
   NEXT_PUBLIC_DEFAULT_ESCROW_DEADLINE_DAYS=7
   NODE_ENV=production
   NEXT_PUBLIC_DEBUG_MODE=false
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 2-5 minutes)

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Confirm settings
   - Wait for deployment

## 🔍 Post-Deployment

### 1. Verify Deployment
- Check your live URL (e.g., `https://your-project.vercel.app`)
- Test wallet connection functionality
- Verify all features work as expected

### 2. Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Configure DNS if needed

### 3. Environment Variables
- Verify all environment variables are set correctly
- Check that wallet functionality works
- Test network switching if applicable

## 🐛 Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Environment Variables
- Double-check all `NEXT_PUBLIC_*` variables are set
- Ensure no typos in variable names
- Verify values match your requirements

### Runtime Errors
- Check browser console for errors
- Verify wallet connection logic
- Test with different browsers

## 📱 Performance Optimization

### 1. Enable Analytics
- Go to Project Settings → Analytics
- Enable Vercel Analytics for performance insights

### 2. Enable Speed Insights
- Go to Project Settings → Speed Insights
- Monitor Core Web Vitals

### 3. Edge Functions (Optional)
- Consider using Edge Functions for better performance
- Configure in `vercel.json` if needed

## 🔄 Continuous Deployment

### Automatic Deployments
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on failures

### Manual Deployments
- Use Vercel dashboard for manual deployments
- Rollback to previous versions if needed

## 📊 Monitoring

### 1. Vercel Dashboard
- Monitor deployment status
- View build logs
- Check performance metrics

### 2. Application Monitoring
- Monitor wallet connection success rates
- Track user interactions
- Monitor error rates

## 🎉 Success!

Your Trustless Work POC is now live on Vercel! 

**Next Steps:**
1. Share your live URL with users
2. Test all functionality thoroughly
3. Monitor performance and errors
4. Consider adding analytics and monitoring

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

---

**Happy Deploying! 🚀⭐**
