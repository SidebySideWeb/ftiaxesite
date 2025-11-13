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

    // Log every API request in production to debug
    console.error('[Payload API Request]', {
      url,
      method: fetchOptions.method || 'GET',
      tenantSlug: this.tenantSlug,
      tenantDomain: this.tenantDomain,
      headers: Object.fromEntries(headers.entries()),
      params,
    })

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        cache: 'no-store',
        next: { revalidate: 0 },
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

      const json = await response.json()

      // Log API response in production to debug
      console.error('[Payload API Response]', {
        url,
        status: response.status,
        tenantSlug: this.tenantSlug,
        hasDocs: Array.isArray(json.docs),
        docCount: Array.isArray(json.docs) ? json.docs.length : 0,
        firstDocSlug: Array.isArray(json.docs) && json.docs.length > 0
          ? json.docs[0]?.slug
          : null,
        firstDocTenant: Array.isArray(json.docs) && json.docs.length > 0
          ? json.docs[0]?.tenant
          : null,
      })

      return json
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
    // Get tenant slug - use fallback if not set
    const tenantSlug = this.tenantSlug || process.env.NEXT_PUBLIC_TENANT_SLUG || 'ftiaxesite'

    // Only filter by slug - access control filters by tenant ID based on X-Tenant-Slug header
    // Payload doesn't support tenant.slug in where clauses, so we rely on the header + access control
    const where: Record<string, any> = {
      slug: { equals: slug },
    }

    // Always log in production to debug tenant scoping
    console.error('[Payload Client] getPage query:', {
      slug,
      tenantSlug,
      where,
      whereString: JSON.stringify(where),
      note: 'Tenant filtering handled by X-Tenant-Slug header + access control',
    })

    const params = {
      ...options.params,
      where: JSON.stringify(where),
      limit: 1,
      depth: options.params?.depth ?? 2,
    }

    // Log the exact params being sent
    console.error('[Payload Client] getPage params:', params)

    return this.request<PayloadResponse<T>>('/pages', {
      ...options,
      params,
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
          where: JSON.stringify({}), // Empty where - tenant filtering handled by access control
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

  const configuredTenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG
  if (!configuredTenantSlug) {
    console.warn(
      '[Payload Client] NEXT_PUBLIC_TENANT_SLUG is not set. Falling back to "ftiaxesite" which may not match production data.',
    )
  }
  const envTenantSlug = configuredTenantSlug || 'ftiaxesite'

  // Always log in production to debug configuration
  console.warn('[Payload Client] createClientWithTenant:', {
    baseUrl,
    tenantSlug: envTenantSlug,
    envTenantSlug: configuredTenantSlug,
    locale,
  })

  const client = createPayloadClient({
    baseUrl,
    tenantSlug: envTenantSlug,
    locale,
  })

  return client
}

export function getBaseUrl(): string {
  return resolveBaseUrl()
}

