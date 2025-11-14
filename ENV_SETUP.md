# Environment Variables Setup for ftiaxesite

## Required Environment Variables

### For Production (Deployed Site)

Create a `.env.local` file or set these in your Vercel/hosting platform:

```env
# CMS API URL (where your CMS is hosted)
NEXT_PUBLIC_PAYLOAD_URL=https://cms.ftiaxesite.gr

# Your site URL (for sitemap and SEO)
NEXT_PUBLIC_SITE_URL=https://ftiaxesite.gr

# Tenant slug (for localhost development only)
NEXT_PUBLIC_TENANT_SLUG=ftiaxesite

# Google Tag Manager ID (optional)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### For Local Development

```env
# Point to your local CMS or production CMS
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
# OR if testing against production CMS:
# NEXT_PUBLIC_PAYLOAD_URL=https://cms.ftiaxesite.gr

# Your local site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Tenant slug (required for localhost to identify tenant)
NEXT_PUBLIC_TENANT_SLUG=ftiaxesite
```

## Important Notes

1. **NEXT_PUBLIC_PAYLOAD_URL**: This must point to your CMS API instance. For production, use `https://cms.ftiaxesite.gr`.

2. **Tenant Domain Matching**: 
   - In production, the site will automatically detect the tenant by matching the domain (e.g., `ftiaxesite.gr`)
   - Make sure the tenant in CMS has `domain` set to `ftiaxesite.gr` (without protocol or port)
   - For localhost, use `NEXT_PUBLIC_TENANT_SLUG` instead

3. **CORS**: Ensure your CMS allows requests from your frontend domain. Check `ALLOWED_ORIGINS` in the CMS `.env` file.

4. **API Client**: This project uses a clean API client with standard `fetch` - no external CMS library dependencies.

## Verifying the Setup

After setting environment variables:

1. Restart your Next.js dev server
2. Check the browser console for `[API Client]` logs (in development mode)
3. Check server logs for any API error messages
4. Visit your site - content should load from CMS instead of fallback data

## Troubleshooting

### "Failed to fetch page data from CMS"
- Check `NEXT_PUBLIC_PAYLOAD_URL` is set correctly
- Verify CMS is accessible at that URL
- Check CORS settings in CMS
- Verify tenant domain matches your site domain

### "No pages found"
- Ensure pages exist in CMS for the tenant
- Check tenant domain/slug matches your configuration
- Verify `allowPublicRead` is enabled for the tenant (if no auth)

### "NEXT_PUBLIC_PAYLOAD_URL is not set"
- Add the environment variable to `.env.local`
- Restart the dev server after adding

