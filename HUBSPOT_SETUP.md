# HubSpot Form Setup Guide

## Overview

The contact form has been migrated from Formspree to HubSpot.

## Form URL

```
https://forms.hubspot.com/uploads/form/v2/147183297/91e2db11-ef0e-4f41-9dba-50eb86c31f21
```

## Current Form Fields

The form submits the following fields:

| Field Name | Type | Required | Purpose |
|------------|------|----------|---------|
| `name` | text | Yes | Full name |
| `email` | email | Yes | Email address |
| `phone` | tel | Yes | Phone number |
| `brief` | textarea | Yes | Project description (voice or text) |

## HubSpot Configuration Required

You need to configure the HubSpot form to accept these fields:

### Standard HubSpot Field Names

HubSpot may expect different field names. Update your HubSpot form to map:

| Our Field | HubSpot Standard | Action |
|-----------|------------------|--------|
| `name` | `firstname` | Add custom field or rename |
| `email` | `email` | Standard field ✅ |
| `phone` | `phone` | Standard field ✅ |
| `brief` | Custom field | Add custom field in HubSpot |

### Setting Up Custom Fields in HubSpot

1. **Log into HubSpot**
   - Go to https://app.hubspot.com/
   - Navigate to **Settings** → **Properties**

2. **Create Custom Field**
   - Property name: `brief` or `project_description`
   - Field type: `Long text` or `Single-line text`
   - Group: `Contact information`
   - Mark as required if needed

3. **Configure Form**
   - Go to **Marketing** → **Lead Capture** → **Forms**
   - Find form with GUID: `91e2db11-ef0e-4f41-9dba-50eb86c31f21`
   - Edit the form
   - Add fields:
     - First name (mapped to our `name`)
     - Email
     - Phone
     - Your custom `brief` field

### Alternative: Keep Our Field Names

If you prefer to keep our field names (`name`, `brief`), you can:

1. In HubSpot form builder, add custom fields with these exact names
2. Or use HubSpot's field mapping to map:
   - `name` → `firstname`
   - `brief` → your custom property name

## Form Behavior

- **Method**: POST
- **Content-Type**: `multipart/form-data` (FormData)
- **CORS**: Uses `no-cors` mode
- **Response**: Not readable (HubSpot limitation)
- **Success**: Assumes success after submission

## Testing

1. **Local Testing**
   ```bash
   npm run dev
   ```
   Navigate to http://localhost:3000 and test the form

2. **Production Testing**
   - Go to https://www.ftiaxesite.gr
   - Fill out and submit the contact form
   - Check HubSpot dashboard for new contacts

3. **Verify Submission**
   - HubSpot Dashboard → **Contacts** → **All contacts**
   - Look for new contact with submission data

## Error Handling

- If submission fails silently, check browser console
- Verify HubSpot form ID is correct
- Ensure all fields are configured in HubSpot form
- Check HubSpot form is active and published

## Migration Notes

### From Formspree to HubSpot

**Differences**:
- Formspree used `mode: 'cors'`, HubSpot uses `mode: 'no-cors'`
- Formspree returns JSON response, HubSpot doesn't
- Formspree requires domain verification, HubSpot doesn't
- HubSpot provides CRM integration, Formspree doesn't

**Advantages of HubSpot**:
- ✅ Free CRM with contact management
- ✅ Lead nurturing workflows
- ✅ No domain verification needed
- ✅ Better analytics and reporting
- ✅ Integration with marketing tools

## Troubleshooting

### Form Not Submitting

1. Check browser console for errors
2. Verify form action URL is correct
3. Ensure all required fields have values
4. Check network tab to see if POST request is sent

### Data Not Appearing in HubSpot

1. Verify contact was created in HubSpot dashboard
2. Check if fields are mapped correctly
3. Look in HubSpot **Properties** to see all fields
4. Verify form is published and active

### Fields Missing in HubSpot

1. Add custom properties in HubSpot settings
2. Configure form to include all fields
3. Publish the updated form

## Next Steps

1. ✅ Configure HubSpot form with all required fields
2. ✅ Test form submission locally and in production
3. ✅ Set up HubSpot workflows for new contacts (optional)
4. ✅ Configure email notifications in HubSpot (optional)

## Resources

- [HubSpot Forms Documentation](https://developers.hubspot.com/docs/api/marketing/forms)
- [HubSpot Contact Properties](https://knowledge.hubspot.com/contacts/use-properties-to-organize-contact-and-company-information)
- [HubSpot Form HTML Integration](https://knowledge.hubspot.com/forms/create-forms/create-a-form-from-scratch-in-hubspot)

