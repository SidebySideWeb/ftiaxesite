# Formspree Setup Guide

## Issue: 403 Error on Form Submission

If you're seeing a `403 Forbidden` error when submitting the contact form, this means Formspree is blocking submissions from your domain.

## Solution: Verify Domain in Formspree

### Step 1: Log into Formspree
1. Go to https://formspree.io/
2. Log in to your account

### Step 2: Navigate to Form Settings
1. Find your form with ID: `movkkzry`
2. Click on the form to open its settings

### Step 3: Add Allowed Domains
1. Look for **Settings** or **Domain Settings**
2. Add the following domains to the allowed list:
   - `ftiaxesite.gr`
   - `www.ftiaxesite.gr`
   - `localhost` (for local testing)

### Step 4: Verify Domain (if required)
- Formspree may require domain verification
- Follow their instructions to verify ownership of `ftiaxesite.gr`
- This usually involves adding a DNS TXT record or verifying via email

### Step 5: Test the Form
1. After adding domains, wait a few minutes for changes to propagate
2. Try submitting the form again from https://www.ftiaxesite.gr/
3. The 403 error should be resolved

## Alternative: Use Formspree's Free Plan Properly

On the free plan, Formspree allows:
- 50 submissions per month
- Email notifications
- Basic spam filtering

Make sure:
- Your form ID `movkkzry` is active
- You've confirmed your email address in Formspree
- The form isn't being rate-limited

## Current Form Configuration

The form is configured as:
- **Method**: POST
- **Action**: https://formspree.io/f/movkkzry
- **CORS Mode**: cors
- **Content-Type**: multipart/form-data (FormData)

## Testing Locally

To test the form locally:
1. Add `localhost:3000` to allowed domains in Formspree
2. Run `npm run dev` in the ftiaxesite directory
3. Navigate to http://localhost:3000
4. Test the form submission

## Troubleshooting

### Still Getting 403 Error?
1. Check browser console for detailed error messages
2. Verify the form ID is correct: `movkkzry`
3. Ensure your Formspree account is active
4. Check Formspree dashboard for submission logs

### Form Submissions Not Arriving?
1. Check spam folder in your email
2. Verify email address in Formspree settings
3. Check Formspree submission history

### CORS Errors?
- The form now includes `mode: 'cors'` in the fetch request
- Formspree should handle CORS automatically once domain is verified

## Contact Formspree Support

If issues persist:
- Email: support@formspree.io
- Docs: https://help.formspree.io/

