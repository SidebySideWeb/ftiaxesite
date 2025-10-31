# CMS Fields Setup Guide

This guide explains the new field structure added to the Pages collection for managing landing page content.

## ✅ What Was Added

The Pages collection now includes a `sections` group field with all the sections needed for your landing page:

### Available Sections:

1. **Header** - Navigation header configuration
2. **Hero** - Hero section with headline, image, and stats
3. **Features** - Features/benefits grid
4. **Process** - Process steps section
5. **Contact** - Contact form configuration
6. **Footer** - Footer content and links

## 📝 How to Use in CMS Admin

### Step 1: Create/Edit a Page

1. Go to **Pages** in CMS admin
2. Create a new page or edit existing "home" page
3. Fill in basic fields:
   - **Title**: "Home" (or your page title)
   - **Slug**: `home` (for homepage)
   - **Tenant**: Select "ftiaxesite"

### Step 2: Configure Sections

Scroll down to the **Sections** group and expand it:

#### Header Section
- **Logo Text**: Your logo/brand name
- **Menu**: Array of menu items (label + link)
- **CTA**: Call-to-action button (label + link)

#### Hero Section
- **Headline**: Main headline text
- **Subheadline**: Supporting text below headline
- **CTA**: Button text (e.g., "Ξεκίνα τώρα")
- **Image**: Upload hero illustration/image
- **Stats**: Array of statistics to display
  - Value (e.g., "48h")
  - Label (e.g., "Παράδοση")

#### Features Section
- **Title**: Section title
- **Subtitle**: Section description
- **Items**: Array of feature items
  - **Icon**: Select from dropdown (clock, euro, trendingUp, shield, smartphone, zap)
  - **Title**: Feature title
  - **Description**: Feature description

#### Process Section
- **Title**: Section title
- **Subtitle**: Section description
- **Steps**: Array of process steps
  - **Number**: Step number (e.g., "01")
  - **Icon**: Select from dropdown (fileText, wand2, checkCircle2)
  - **Title**: Step title
  - **Description**: Step description
  - **Color**: Select "teal" or "navy"

#### Contact Section
- **Title**: Section title
- **Subtitle**: Section description
- **Form**: Form field labels
  - Name, Email, Phone labels
  - Voice prompt text
  - Submit button text

#### Footer Section
- **Brand**: Brand name and tagline
- **Contact**: Contact information (title, email, phone)
- **Links**: Footer links array (label + href)
- **Copyright**: Copyright text

## 🎯 Quick Start Example

To quickly set up your homepage:

1. **Create page** with slug "home"
2. **Expand Sections** group
3. **Fill Hero section**:
   - Headline: "Φτιάξε το site σου σε 48 ώρες — από 250€"
   - Subheadline: "Με τη δύναμη της Τεχνητής Νοημοσύνης..."
   - Upload hero image
   - Add 3 stats
4. **Fill Features section**:
   - Add 6 feature items
   - Select icons for each
5. **Fill Process section**:
   - Add 3 process steps
6. **Fill Contact & Footer** sections
7. **Save** the page

## 🔄 How It Works

The frontend automatically:
1. Fetches the page from CMS by slug "home"
2. Checks if `sections` field exists
3. Maps section data to component props
4. Falls back to default data if sections are empty

## 💡 Tips

- **Icons**: Use lowercase icon names (e.g., "clock", not "Clock")
- **Images**: Upload images to Media collection first, then select them
- **Arrays**: Use the "+ Add" button to add multiple items
- **Colors**: Use "teal" or "navy" for process step colors
- **Optional Fields**: Most fields are optional - only fill what you need

## 🐛 Troubleshooting

### "Sections not showing in admin"
- Make sure you've restarted the CMS server after the update
- Clear browser cache and refresh admin panel

### "Changes not appearing on frontend"
- Check that `NEXT_PUBLIC_PAYLOAD_URL` is set correctly
- Verify tenant is selected when creating page
- Ensure page slug matches what frontend is fetching ("home")

### "Images not loading"
- Upload images to Media collection first
- Make sure tenant is selected when uploading
- Check image URL in browser console

---

**Need Help?** Check the main setup guide: `CONTENT_MANAGEMENT_SETUP.md`

