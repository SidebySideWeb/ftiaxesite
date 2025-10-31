# ftiaxesite

This is a Next.js client website that connects to the multi-tenant Payload CMS.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001)

## 📋 Prerequisites

- Node.js 18+ or 20+
- Payload CMS running (see `multi-tenant` project)
- Environment variables configured

## ⚙️ Environment Variables

Create `.env.local` file with:

```env
# Required
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Optional
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## 📦 Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete deployment guide.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_PAYLOAD_URL` - Your Payload CMS URL
   - `NEXT_PUBLIC_SITE_URL` - Your site URL
   - `NEXT_PUBLIC_GTM_ID` - Google Tag Manager ID (optional)
4. Deploy!

## 📚 Documentation

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Complete deployment guide
- [CONTENT_MANAGEMENT_SETUP.md](./CONTENT_MANAGEMENT_SETUP.md) - CMS setup guide
- [CMS_FIELDS_GUIDE.md](./CMS_FIELDS_GUIDE.md) - Field structure guide

## 🎨 Features

- ✅ Exact UI from template site (without CloudCannon)
- ✅ Payload CMS integration
- ✅ Responsive design
- ✅ Voice input form
- ✅ Custom 404 page
- ✅ SEO optimized (sitemap, robots.txt)
- ✅ Web performance optimized

## 🔧 Development

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## 📝 Next Steps

1. Configure CMS URL in `.env.local`
2. Create content in Payload CMS admin panel
3. Deploy to Vercel (see deployment guide)
