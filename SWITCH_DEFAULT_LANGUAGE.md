# How to Change Default Language

## Quick Answer
**Yes, change it in the frontend repo only** (this repo - `ftiaxesite`).

The CMS localization settings don't affect which language is the default on your website.

## Steps to Make English the Default

### 1. Update LanguageSwitcher Component
**File**: `components/LanguageSwitcher.tsx`

Change:
```typescript
export const defaultLocale: Locale = 'el'  // ❌ OLD
```

To:
```typescript
export const defaultLocale: Locale = 'en'  // ✅ NEW
```

### 2. Update HTML Lang Attribute  
**File**: `app/layout.tsx`

Change:
```tsx
<html lang="el" ...>  // ❌ OLD
```

To:
```tsx
<html lang="en" ...>  // ✅ NEW
```

### 3. Update Metadata (Optional)
**File**: `app/layout.tsx`

Update the default meta title/description to English:
```typescript
export const metadata: Metadata = {
  title: "ftiaxesite.gr – Website in 48 Hours from €250",  // English title
  description: "AI-powered websites, SEO-ready, in 48 hours.",  // English description
}
```

### 4. Update Default Data (Optional)
**File**: `app/page.tsx`

If you want English content as fallback (when CMS is down), update the `defaultData` object to use English text instead of Greek.

## That's It!

After making these changes:
- **Greek**: Only shown when user clicks "EL" or `?lang=el` is in URL
- **English**: Default language, shown on first visit
- **CMS**: No changes needed - it supports both languages

## Per-Project Configuration

Since you asked "one of my projects":

You can have **different defaults per frontend**:
- **ftiaxesite**: Greek default (current)
- **Other client site**: English default
- **Another client site**: German default

Each frontend repo controls its own default language, but they all use the same CMS which has all translations.

## Testing

After changing:
1. Clear browser cache/localStorage
2. Visit site without `?lang=`
3. Should see English by default
4. Clicking "EL" should switch to Greek

