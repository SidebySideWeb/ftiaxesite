/**
 * API Client utilities for Next.js frontend integration
 * 
 * This file provides helper functions to fetch content from the Payload CMS
 * for use in client Next.js websites.
 */

export interface ApiClientOptions {
  baseUrl: string
  tenantSlug?: string
  tenantDomain?: string
  locale?: string
  headers?: HeadersInit
}

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

/**
 * Payload API response structure
 */
export interface PayloadResponse<T = any> {
  docs: T[]
  totalDocs?: number
  limit?: number
  totalPages?: number
  page?: number
  pagingCounter?: number
  hasPrevPage?: boolean
  hasNextPage?: boolean
  prevPage?: number | null
  nextPage?: number | null
}

/**
 * Creates an API client instance for fetching content
 */
export class PayloadApiClient {
  private baseUrl: string
  private tenantSlug?: string
  private tenantDomain?: string
  private locale?: string
  private defaultHeaders: HeadersInit

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.tenantSlug = options.tenantSlug
    this.tenantDomain = options.tenantDomain
    this.locale = options.locale
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  }

  /**
   * Builds the API URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}/api${endpoint}`)
    
    // Add locale parameter if set
    if (this.locale) {
      url.searchParams.append('locale', this.locale)
    }
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    return url.toString()
  }

  /**
   * Makes a request to the Payload API
   */
  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options
    const url = this.buildUrl(endpoint, params)

    const headers = new Headers(this.defaultHeaders)
    
    // Add tenant context if provided
    if (this.tenantSlug) {
      headers.set('X-Tenant-Slug', this.tenantSlug)
    }
    if (this.tenantDomain) {
      headers.set('X-Tenant-Domain', this.tenantDomain)
    }

    // Merge custom headers
    if (fetchOptions.headers) {
      const customHeaders = new Headers(fetchOptions.headers)
      customHeaders.forEach((value, key) => {
        headers.set(key, value)
      })
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `API request failed: ${response.statusText}`
        try {
          const error = JSON.parse(errorText)
          errorMessage = error.message || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        // Enhanced error logging
        console.error('[Payload API Error]', {
          url,
          status: response.status,
          statusText: response.statusText,
          tenantSlug: this.tenantSlug,
          tenantDomain: this.tenantDomain,
          error: errorMessage,
        })
        
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      // Network errors or other fetch failures
      if (error instanceof Error) {
        console.error('[Payload API Request Failed]', {
          url,
          tenantSlug: this.tenantSlug,
          tenantDomain: this.tenantDomain,
          error: error.message,
        })
      }
      throw error
    }
  }

  /**
   * Fetches a single page by slug
   */
  async getPage<T = any>(slug: string, options: FetchOptions = {}): Promise<PayloadResponse<T>> {
    const where: Record<string, any> = {
      slug: { equals: slug },
    }

    return this.request<PayloadResponse<T>>('/pages', {
      ...options,
      params: {
        ...options.params,
        where: JSON.stringify(where),
        limit: 1,
        depth: options.params?.depth ?? 2,
      },
    })
  }

  async getPageBySlug<T = any>(slug: string, options: FetchOptions = {}): Promise<T | null> {
    const result = await this.getPage<T>(slug, options)
    return result.docs?.[0] ?? null
  }

  /**
   * Fetches all pages for the tenant
   */
  async getPages<T = any>(options: FetchOptions = {}): Promise<PayloadResponse<T>> {
    return this.request<PayloadResponse<T>>('/pages', {
      ...options,
      params: {
        ...options.params,
        depth: options.params?.depth ?? 2,
      },
    })
  }

  /**
   * Fetches a single media file by ID
   */
  async getMedia(id: string | number, options: FetchOptions = {}) {
    return this.request(`/media/${id}`, {
      ...options,
      params: {
        ...options.params,
        depth: 1,
      },
    })
  }

  /**
   * Fetches media files for the tenant
   */
  async getMediaFiles(options: FetchOptions = {}) {
    return this.request(
      '/media',
      {
        ...options,
        params: {
          ...options.params,
          where: JSON.stringify({
            ...(this.tenantSlug && {
              'tenant.slug': { equals: this.tenantSlug },
            }),
            ...(this.tenantDomain && {
              'tenant.domain': { equals: this.tenantDomain },
            }),
          }),
          depth: 1,
        },
      }
    )
  }

  /**
   * Fetches tenant information
   */
  async getTenant(options: FetchOptions = {}) {
    const where: Record<string, any> = {}
    
    if (this.tenantSlug) {
      where.slug = { equals: this.tenantSlug }
    } else if (this.tenantDomain) {
      where.domain = { equals: this.tenantDomain }
    }

    return this.request(
      '/tenants',
      {
        ...options,
        params: {
          ...options.params,
          where: JSON.stringify(where),
          limit: 1,
          depth: 1,
        },
      }
    )
  }

  /**
   * Generic GET request
   */
  async get<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * Generic POST request
   */
  async post<T = any>(endpoint: string, data?: any, options: FetchOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

/**
 * Creates a Payload API client instance
 */
export function createPayloadClient(options: ApiClientOptions): PayloadApiClient {
  return new PayloadApiClient(options)
}

/**
 * Helper function to convert relative media URLs to absolute URLs
 * If the URL is already absolute, returns it as-is
 * If the URL is relative (starts with /), prepends the CMS base URL
 */
export function getAbsoluteMediaUrl(url: string | undefined | null): string {
  if (!url) return ''
  
  // If already absolute URL (starts with http:// or https://), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If relative URL (starts with /), prepend CMS base URL
  if (url.startsWith('/')) {
    const baseUrl = getBaseUrl()
    if (!baseUrl) {
      console.warn('NEXT_PUBLIC_PAYLOAD_URL not set, cannot convert relative media URL:', url)
      return url
    }
    return `${baseUrl}${url}`
  }
  
  // If no protocol and no leading slash, assume it's a relative path
  return url
}

function resolveBaseUrl(): string {
  const envBase =
    (process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || '').replace(/\/$/, '')
  if (envBase) {
    return envBase
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[Payload Client] NEXT_PUBLIC_PAYLOAD_URL is not set. CMS requests will fail in production.',
    )
  }

  return ''
}

function inferTenantSlugFromDomain(domain?: string | null): string | undefined {
  if (!domain) return undefined

  const normalized = domain.toLowerCase()
  const domainMap: Record<string, string> = {
    'ftiaxesite.gr': 'ftiaxesite',
    'www.ftiaxesite.gr': 'ftiaxesite',
    'ftiaxesite.vercel.app': 'ftiaxesite',
    'ftiaxesite.sidebysites.dev': 'ftiaxesite',
    'kallitechnia.gr': 'kallitechnia',
    'www.kallitechnia.gr': 'kallitechnia',
    'kallitechnia.vercel.app': 'kallitechnia',
    'kalitechnia.gr': 'kallitechnia',
    'www.kalitechnia.gr': 'kallitechnia',
    'kalitechnia.vercel.app': 'kallitechnia',
    'kaliitechnia.gr': 'kallitechnia',
    'www.kaliitechnia.gr': 'kallitechnia',
    'kaliitechnia.vercel.app': 'kallitechnia',
    'kalitechnia.ftiaxesite.gr': 'kallitechnia',
    'kallitechnia.ftiaxesite.gr': 'kallitechnia',
    'kaliitechnia.ftiaxesite.gr': 'kallitechnia',
  }
 
  const mapped = domainMap[normalized]
  if (mapped) return mapped

  if (normalized.includes('ftiaxesite')) {
    return 'ftiaxesite'
  }

  if (
    normalized.includes('kallitechnia') ||
    normalized.includes('kalitechnia') ||
    normalized.includes('kaliitechnia')
  ) {
    return 'kallitechnia'
  }

  return undefined
}

/**
 * Helper function to create a client with automatic tenant detection
 * Use this in Next.js server components or API routes
 */
export function createClientWithTenant(locale?: string): PayloadApiClient {
  const baseUrl = resolveBaseUrl()

  if (!baseUrl) {
    console.warn('[Payload Client] NEXT_PUBLIC_PAYLOAD_URL is not set. CMS requests will fail.')
  }

  const envTenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || undefined
 
  if (!envTenantSlug) {
    console.warn('[Payload Client] NEXT_PUBLIC_TENANT_SLUG is not set. Tenant-scoped requests may fail.')
  }

  const client = createPayloadClient({
    baseUrl,
    tenantSlug: envTenantSlug,
    locale,
  })

  if (process.env.NODE_ENV === 'development') {
    console.log('[Payload Client]', {
      baseUrl,
      tenantSlug: envTenantSlug,
    })
  }

  return client
}

export function getBaseUrl(): string {
  return resolveBaseUrl()
}

