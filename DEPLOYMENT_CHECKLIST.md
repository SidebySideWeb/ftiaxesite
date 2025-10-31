# Deployment Checklist - ftiaxesite

Use this checklist before deploying to Vercel.

## ✅ Pre-Deployment

### Code & Build
- [ ] Code is committed and pushed to GitHub
- [ ] `npm run build` succeeds locally
- [ ] `npm start` works locally
- [ ] No TypeScript errors
- [ ] No linting errors

### Environment Variables
- [ ] `NEXT_PUBLIC_PAYLOAD_URL` - Production CMS URL set
- [ ] `NEXT_PUBLIC_SITE_URL` - Production site URL set
- [ ] `NEXT_PUBLIC_GTM_ID` - GTM ID set (if using analytics)

### CMS Configuration
- [ ] Payload CMS is deployed and accessible
- [ ] CORS configured in Payload (`ALLOWED_ORIGINS` includes your domain)
- [ ] Tenant created in Payload CMS
- [ ] Homepage content created/populated
- [ ] Media uploads working (if using images)

### Content
- [ ] Homepage content is populated in CMS
- [ ] Header menu items are set
- [ ] Footer content is configured
- [ ] All sections have content (or defaults work)

## 🚀 Deployment Steps

1. [ ] Push code to GitHub
2. [ ] Import project to Vercel
3. [ ] Set root directory to `ftiaxesite` (if deploying from monorepo)
4. [ ] Configure environment variables in Vercel
5. [ ] Deploy

## ✅ Post-Deployment

### Verification
- [ ] Site loads at production URL
- [ ] CMS data loads correctly (not fallback data)
- [ ] Images load properly
- [ ] Navigation works
- [ ] Forms work (if applicable)
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`
- [ ] 404 page works

### Performance
- [ ] Page loads quickly
- [ ] Images optimized
- [ ] No console errors
- [ ] Lighthouse score acceptable

### SEO
- [ ] Meta tags present
- [ ] Sitemap submitted to Google Search Console
- [ ] Robots.txt configured correctly

## 🔍 Troubleshooting

If something doesn't work:

1. **Check Vercel Logs:**
   - Dashboard → Your Project → Functions → Logs

2. **Check Environment Variables:**
   - Dashboard → Settings → Environment Variables

3. **Verify CMS Connection:**
   - Test CMS URL directly in browser
   - Check CORS headers

4. **Check Build Logs:**
   - Look for errors during build
   - Verify all dependencies installed

## 📞 Support

- Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed guide
- Check Vercel documentation
- Check Payload CMS logs

---

**Ready?** Complete all checkboxes and deploy! 🚀

