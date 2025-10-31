# Vercel Deployment Guide - ftiaxesite

Complete guide for deploying ftiaxesite to Vercel.

## 🚀 Quick Deploy

1. **Push to GitHub** (if not already)
2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `ftiaxesite` folder as root directory (or deploy the whole repo)

3. **Configure Environment Variables** (see below)

4. **Deploy!**

## 📋 Required Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_PAYLOAD_URL` | Your Payload CMS API URL | `https://cms.ftiaxesite.gr` |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (for sitemap/robots) | `https://ftiaxesite.gr` |

### Optional

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID | `GTM-XXXXXXX` |

## 🔧 Configuration Steps

### 1. Payload CMS URL

**Important:** Your Payload CMS must be accessible from Vercel.

- If Payload CMS is on a different domain: Use full URL with `https://`
- If Payload CMS is on same domain: Configure CORS in Payload config
- Make sure `ALLOWED_ORIGINS` in Payload includes your Vercel domain

**Example:**
```
NEXT_PUBLIC_PAYLOAD_URL=https://cms.ftiaxesite.gr
```

### 2. Site URL

Used for sitemap.xml and robots.txt generation:

```
NEXT_PUBLIC_SITE_URL=https://ftiaxesite.gr
```

### 3. Google Tag Manager (Optional)

If you want analytics:

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## 🌍 Environment-Specific Variables

### Production

In Vercel Dashboard, set environment to **Production**:

```
NEXT_PUBLIC_PAYLOAD_URL=https://cms.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://ftiaxesite.gr
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Preview (Optional)

For preview deployments, you might want different URLs:

```
NEXT_PUBLIC_PAYLOAD_URL=https://cms.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://preview-ftiaxesite.vercel.app
```

## ✅ Pre-Deployment Checklist

- [ ] Payload CMS is deployed and accessible
- [ ] CORS is configured in Payload CMS (`ALLOWED_ORIGINS`)
- [ ] Environment variables are set in Vercel
- [ ] `NEXT_PUBLIC_PAYLOAD_URL` points to production CMS
- [ ] `NEXT_PUBLIC_SITE_URL` matches your domain
- [ ] Google Tag Manager ID is set (if using)
- [ ] Test build locally: `npm run build`

## 🧪 Testing Locally Before Deploy

1. **Set environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with production values
   ```

2. **Test build:**
   ```bash
   npm run build
   npm start
   ```

3. **Verify:**
   - Site loads correctly
   - CMS data fetches successfully
   - Images load properly
   - No console errors

## 🔍 Troubleshooting

### Build Fails

**Error:** `Module not found` or `Cannot find module`

**Solution:**
- Check all dependencies are in `package.json`
- Run `npm install` locally to verify
- Check `next.config.ts` for any issues

### CMS Data Not Loading

**Error:** Site loads but shows default/fallback data

**Check:**
1. `NEXT_PUBLIC_PAYLOAD_URL` is set correctly
2. Payload CMS is accessible from Vercel
3. CORS is configured in Payload CMS
4. Check Vercel function logs for errors

**Debug:**
- Check Vercel → Functions → Logs
- Look for fetch errors
- Verify CMS URL is accessible

### Images Not Loading

**Error:** Images from CMS return 404

**Solution:**
- Ensure Payload CMS media URLs are absolute (not relative)
- Check Supabase Storage configuration
- Verify media files are uploaded correctly

### Sitemap/Robots Not Working

**Error:** `/sitemap.xml` or `/robots.txt` returns 404

**Solution:**
- Verify `NEXT_PUBLIC_SITE_URL` is set
- Check `vercel.json` rewrites are correct
- Rebuild after changing environment variables

## 📊 Post-Deployment

### Verify Deployment

1. **Check site loads:** `https://your-site.vercel.app`
2. **Check CMS connection:** Content should load from Payload
3. **Check sitemap:** `https://your-site.vercel.app/sitemap.xml`
4. **Check robots:** `https://your-site.vercel.app/robots.txt`

### Monitor

- **Vercel Dashboard:** Check function logs
- **Browser Console:** Check for errors
- **Network Tab:** Verify CMS requests succeed

## 🔄 Updating Content

After deployment, content changes in Payload CMS will:
- ✅ Automatically reflect on the site (server-side rendering)
- ✅ Be cached by Vercel (may take a few minutes)
- ✅ Can be force-refreshed by redeploying

## 📝 Domain Configuration

To use a custom domain:

1. **Add domain in Vercel:**
   - Project Settings → Domains
   - Add your domain (e.g., `ftiaxesite.gr`)

2. **Update DNS:**
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation

3. **Update environment variable:**
   - Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## 🚨 Common Issues

### CORS Errors

**Solution:** Add your Vercel domain to Payload CMS `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS=https://ftiaxesite.gr,https://ftiaxesite.vercel.app
```

### Environment Variables Not Updating

**Solution:** Redeploy after changing environment variables in Vercel dashboard.

### Build Timeout

**Solution:** 
- Check build logs for slow operations
- Optimize images and assets
- Consider upgrading Vercel plan if needed

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Payload CMS Deployment](https://payloadcms.com/docs/deployment)

---

**Ready to deploy?** Follow the Quick Deploy steps above! 🚀

