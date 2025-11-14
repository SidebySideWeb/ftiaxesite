# Multilingual Setup Guide

## Overview

This project supports **Greek (el)** and **English (en)** through Payload CMS localization.

## Architecture

Instead of using a third-party i18n library, we leverage **Payload CMS's built-in localization** feature:

1. **CMS stores translations** - Each page/collection can have multiple language versions
2. **Frontend requests content** - Based on the language preference
3. **Simple language switcher** - Changes the locale parameter

## Implementation Steps

### 1. CMS Configuration (Payload)

Add localization to the Pages collection in `multi-tenant/multi-tenant/src/collections/Pages/index.ts`:

```typescript
import { CollectionConfig } from 'payload/types'

const Pages: CollectionConfig = {
  slug: 'pages',
  
  // Enable localization
  localization: {
    locales: ['el', 'en'],
    defaultLocale: 'el',
  },
  
  // ... rest of configuration
}
```

### 2. Frontend Language Detection

Create `lib/locale.ts`:

```typescript
export const locales = ['el', 'en'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'el'

// Get locale from search params or user preference
export function getLocale(searchParams?: { lang?: string }): Locale {
  if (searchParams?.lang && locales.includes(searchParams.lang as Locale)) {
    return searchParams.lang as Locale
  }
  
  // Try to get from localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('locale')
    if (stored && locales.includes(stored as Locale)) {
      return stored as Locale
    }
  }
  
  return defaultLocale
}
```

### 3. Language Switcher Component

Add to Header component:

```tsx
"use client"

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { locales, type Locale } from '@/lib/locale'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = searchParams.get('lang') || 'el'
  
  const switchLanguage = (locale: Locale) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', locale)
    router.push(`${pathname}?${params.toString()}`)
    localStorage.setItem('locale', locale)
  }
  
  return (
    <div className="flex gap-2">
      {locales.map(locale => (
        <Button
          key={locale}
          variant={currentLocale === locale ? 'default' : 'outline'}
          onClick={() => switchLanguage(locale)}
          className="w-10 h-10 p-0 text-sm font-bold"
        >
          {locale.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}
```

### 4. Update API Client Calls

In `lib/api-client.ts`, locale support is already included in the API client:

```typescript
// The API client automatically includes locale in requests
const client = getApiClient()
const page = await client.getPage(slug, depth)

// Locale is automatically added to query params:
// /api/pages?where=...&locale=el
  }
}
```

## Benefits of This Approach

✅ **No extra dependencies** - Uses Payload's built-in features
✅ **CMS-managed translations** - Content creators can manage all languages in admin
✅ **SEO-friendly** - Each language has its own URL with `?lang=en`
✅ **Simple implementation** - Minimal code changes
✅ **Scalable** - Easy to add more languages later

## Next Steps

1. Enable localization in Payload CMS Pages collection
2. Add language switcher to Header
3. Update API calls to include locale parameter
4. Test both languages thoroughly
5. Add language-specific meta tags for SEO

## Testing

- Visit `/` - Should show Greek (default)
- Click "EN" - Should switch to English
- Refresh page - Should remember language preference
- Test all page sections in both languages

