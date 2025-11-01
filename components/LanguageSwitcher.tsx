"use client"

import { useState, useEffect } from "react"
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export type Locale = 'el' | 'en'
export const locales: Locale[] = ['el', 'en']
export const defaultLocale: Locale = 'el'

export function LanguageSwitcher() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  // Set initial locale from URL or localStorage
  useEffect(() => {
    setMounted(true)
    
    // Get locale from URL params
    const urlLocale = searchParams.get('lang') as Locale | null
    if (urlLocale && locales.includes(urlLocale)) {
      setCurrentLocale(urlLocale)
      localStorage.setItem('locale', urlLocale)
    } else {
      // Get from localStorage or use default
      const stored = localStorage.getItem('locale') as Locale | null
      if (stored && locales.includes(stored)) {
        setCurrentLocale(stored)
      }
    }
  }, [searchParams])

  const switchLanguage = (locale: Locale) => {
    if (locale === currentLocale) return
    
    setCurrentLocale(locale)
    localStorage.setItem('locale', locale)
    
    // Update URL with new locale parameter
    const params = new URLSearchParams(searchParams.toString())
    if (locale === defaultLocale) {
      // Remove lang param for default locale
      params.delete('lang')
    } else {
      params.set('lang', locale)
    }
    
    // Reload page with new locale
    router.push(`${pathname}${params.toString() ? '?' + params.toString() : ''}`)
  }

  // Don't render until mounted (avoid hydration mismatch)
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-gray-600" />
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 text-sm font-bold"
            disabled
          >
            EL
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 text-sm font-bold"
            disabled
          >
            EN
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-600" />
      <div className="flex gap-1">
        {locales.map(locale => (
          <Button
            key={locale}
            variant={currentLocale === locale ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchLanguage(locale)}
            className={`w-10 h-10 p-0 text-sm font-bold transition-all ${
              currentLocale === locale 
                ? 'bg-brand-teal hover:bg-brand-teal/90 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            aria-label={`Switch to ${locale === 'el' ? 'Greek' : 'English'}`}
          >
            {locale.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  )
}

