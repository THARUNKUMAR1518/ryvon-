# VERCEL DEPLOYMENT INSTRUCTIONS

## Quick Deploy Steps

### 1. Setup MongoDB Atlas (5 minutes)

1. Visit: https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create a cluster (free tier)
4. Create database user
5. Whitelist IP: 0.0.0.0/0 (all IPs)
6. Get connection string

### 2. Deploy to Vercel (2 minutes)

#### Using Vercel Website:
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import: `THARUNKUMAR1518/ryvon-`
5. Click "Deploy"

### 3. Add Environment Variables (1 minute)

In Vercel Dashboard → Settings → Environment Variables, add:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/ryvon
JWT_SECRET = your-random-secret-string-12345
NODE_ENV = production
```

### 4. Redeploy

Vercel Dashboard → Deployments → Redeploy

### 5. Done! 🎉

Your site is live at: `https://your-project.vercel.app`

## Testing Checklist

- [ ] Homepage loads
- [ ] Click "Start Free Trial" → Register works
- [ ] Login works
- [ ] Dashboard displays
- [ ] Contact form works

## Troubleshooting

**MongoDB Connection Error:**
- Check connection string is correct
- Verify IP whitelist includes 0.0.0.0/0
- Make sure database user exists

**API Not Working:**
- Check environment variables are set
- Look at Vercel logs (Functions tab)
- Verify API routes in vercel.json

## Need Help?

Contact: ryvoninfotech@gmail.com
Phone: +91 76393 00330
