# Content Management Setup Guide for ftiaxesite Tenant

This guide will help you set up and manage content for your "ftiaxesite" tenant.

## ✅ Current Status

- ✅ Tenant "ftiaxesite" has been created in the CMS
- ✅ Frontend site is ready to connect
- ⚠️ Next steps needed for content management

## 📋 Required Setup Steps

### 1. Configure Environment Variables

Create a `.env.local` file in your `ftiaxesite` project root:

```env
# Payload CMS URL (where your CMS is running)
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000

# Your site URL (for sitemap and SEO)
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Google Tag Manager ID (optional)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**For Production:**
```env
NEXT_PUBLIC_PAYLOAD_URL=https://your-cms-domain.com
NEXT_PUBLIC_SITE_URL=https://ftiaxesite.gr
```

### 2. Configure Tenant in CMS Admin

Go to your CMS admin panel (`http://localhost:3000/admin`) and:

1. **Navigate to Tenants** → Click on "ftiaxesite" tenant
2. **Set Domain** (for domain-based routing):
   - Domain: `localhost` (for development) or `ftiaxesite.gr` (for production)
   - OR set **Slug** if using slug-based routing: `ftiaxesite`
3. **Enable Public Read** (if you want public API access):
   - Check ✅ `allowPublicRead` checkbox

### 3. Create a User with Tenant Admin Access

1. Go to **Users** in CMS admin
2. Create a new user or edit an existing user
3. Assign them to the "ftiaxesite" tenant with **tenant-admin** role
4. This user will be able to:
   - Create and edit pages
   - Upload media files
   - Manage content for the ftiaxesite tenant

### 4. Create Your First Page

1. Go to **Pages** in CMS admin
2. Click **Create New**
3. Fill in:
   - **Title**: "Home" (or your page title)
   - **Slug**: `home` (required for homepage)
   - **Tenant**: Select "ftiaxesite"
   - **Description**: Meta description for SEO
   - **Content**: Rich text content (optional)
   - **Featured Image**: Upload an image (optional)
   - **Published At**: Set publication date
4. Click **Save**

### 5. Upload Media Files

1. Go to **Media** in CMS admin
2. Click **Upload** to add images/files
3. Files will be automatically scoped to your tenant

## 🔍 How Tenant Detection Works

Your frontend automatically detects the tenant using:

1. **Domain-based** (recommended): Detects from hostname
   - Example: `ftiaxesite.gr` → finds tenant with domain "ftiaxesite.gr"
2. **Slug-based**: Uses tenant slug from URL path
   - Example: `/ftiaxesite/home` → finds tenant with slug "ftiaxesite"

## 📝 Content Structure

The Pages collection has these fields:
- **title**: Page title
- **slug**: URL slug (e.g., "home", "about", "contact")
- **description**: Meta description for SEO
- **content**: Rich text editor content
- **featuredImage**: Featured image upload
- **meta**: SEO metadata (title, description, ogImage)
- **publishedAt**: Publication date

## 🚀 Testing the Connection

1. Start your CMS server:
   ```bash
   cd multi-tenant
   npm run dev
   ```

2. Start your frontend:
   ```bash
   cd ftiaxesite
   npm run dev
   ```

3. Visit `http://localhost:3001` (or your frontend port)

4. Check browser console for any errors

5. If CMS connection works, you should see content from CMS instead of default fallback data

## 🐛 Troubleshooting

### "Failed to fetch page data from CMS"
- Check `NEXT_PUBLIC_PAYLOAD_URL` is set correctly
- Ensure CMS server is running
- Verify tenant domain/slug matches your setup
- Check CORS settings in CMS `.env`:
  ```env
  ALLOWED_ORIGINS=http://localhost:3001,https://ftiaxesite.gr
  ```

### "No pages found"
- Create a page with slug "home" for the tenant
- Ensure tenant is selected when creating the page
- Check user has access to the tenant

### "Cannot access tenant"
- Ensure `allowPublicRead` is enabled for public access
- OR ensure user is logged in with tenant-admin access

## 📚 Next Steps

1. Create additional pages (about, contact, etc.)
2. Upload images to Media collection
3. Customize page content using the rich text editor
4. Set up SEO metadata for each page
5. Test in production environment

## 💡 Tips

- Use **slug** field for clean URLs: `about`, `services`, `contact`
- Set **publishedAt** date to control when content goes live
- Use **featuredImage** for hero images and page previews
- Fill **meta** fields for better SEO and social sharing

---

**Need Help?** Check the main integration guide: `multi-tenant/INTEGRATION_GUIDE.md`

