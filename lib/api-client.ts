/**
 * Simple API Client for fetching content from CMS
 * Uses standard fetch - no Payload CMS dependencies
 */

interface ApiResponse<T = unknown> {
  docs: T[]
  totalDocs?: number
  limit?: number
  totalPages?: number
  page?: number
  hasPrevPage?: boolean
  hasNextPage?: boolean
  prevPage?: number | null
  nextPage?: number | null
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

class ApiClient {
  private baseUrl: string
  private tenantSlug?: string
  private locale?: string

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_URL || ''
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'ftiaxesite'
    this.locale = 'el'
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    if (!this.baseUrl) {
      throw new Error('NEXT_PUBLIC_PAYLOAD_URL is not configured')
    }

    const url = new URL(`${this.baseUrl}/api${endpoint}`)

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

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options
    const url = this.buildUrl(endpoint, params)

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    })

    if (this.tenantSlug) {
      headers.set('X-Tenant-Slug', this.tenantSlug)
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        cache: 'no-store',
        next: { revalidate: 0 },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[API Client] Request failed:', { url, error })
      throw error
    }
  }

  /**
   * Fetch tenant information by slug
   */
  async getTenant(): Promise<{ id: number | string; slug: string } | null> {
    if (!this.tenantSlug) {
      return null
    }

    try {
      const response = await this.request<ApiResponse<{ id: number | string; slug: string }>>('/tenants', {
        params: {
          where: JSON.stringify({ slug: { equals: this.tenantSlug } }),
          limit: 1,
          depth: 0,
        },
      })

      return response.docs?.[0] ?? null
    } catch (error) {
      console.error('[API Client] Failed to fetch tenant:', error)
      return null
    }
  }

  /**
   * Fetch a page by slug
   */
  async getPage<T = unknown>(slug: string, depth: number = 2): Promise<T | null> {
    // First, get tenant ID
    const tenant = await this.getTenant()
    if (!tenant) {
      console.warn('[API Client] Tenant not found, filtering may not work correctly')
    }

    const where: Record<string, unknown> = {
      slug: { equals: slug },
    }

    if (tenant?.id) {
      where.tenant = { equals: tenant.id }
    }

    try {
      const response = await this.request<ApiResponse<T>>('/pages', {
        params: {
          where: JSON.stringify(where),
          limit: 1,
          depth,
        },
      })

      return response.docs?.[0] ?? null
    } catch (error) {
      console.error('[API Client] Failed to fetch page:', { slug, error })
      return null
    }
  }

  /**
   * Fetch pages (list)
   */
  async getPages<T = unknown>(options: { limit?: number; depth?: number; where?: Record<string, unknown> } = {}): Promise<T[]> {
    const tenant = await this.getTenant()
    
    const where: Record<string, unknown> = {
      ...options.where,
    }

    if (tenant?.id) {
      where.tenant = { equals: tenant.id }
    }

    try {
      const response = await this.request<ApiResponse<T>>('/pages', {
        params: {
          where: JSON.stringify(where),
          limit: options.limit ?? 100,
          depth: options.depth ?? 2,
        },
      })

      return response.docs ?? []
    } catch (error) {
      console.error('[API Client] Failed to fetch pages:', error)
      return []
    }
  }

  /**
   * Fetch a media file by ID
   */
  async getMedia<T = unknown>(id: string | number): Promise<T | null> {
    try {
      return await this.request<T>(`/media/${id}`, {
        params: {
          depth: 1,
        },
      })
    } catch (error) {
      console.error('[API Client] Failed to fetch media:', { id, error })
      return null
    }
  }

  /**
   * Fetch media files (list)
   */
  async getMediaFiles<T = unknown>(options: { limit?: number } = {}): Promise<T[]> {
    const tenant = await this.getTenant()
    
    const where: Record<string, unknown> = {}
    if (tenant?.id) {
      where.tenant = { equals: tenant.id }
    }

    try {
      const response = await this.request<ApiResponse<T>>('/media', {
        params: {
          where: JSON.stringify(where),
          limit: options.limit ?? 100,
          depth: 1,
        },
      })

      return response.docs ?? []
    } catch (error) {
      console.error('[API Client] Failed to fetch media files:', error)
      return []
    }
  }
}

/**
 * Get or create API client instance
 */
let clientInstance: ApiClient | null = null

export function getApiClient(): ApiClient {
  if (!clientInstance) {
    clientInstance = new ApiClient()
  }
  return clientInstance
}

/**
 * Helper to convert relative media URLs to absolute URLs
 */
export function getAbsoluteMediaUrl(url: string | undefined | null): string {
  if (!url) return ''
  
  // If already absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If relative URL (starts with /), prepend CMS base URL
  if (url.startsWith('/')) {
    const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || process.env.PAYLOAD_URL || ''
    if (!baseUrl) {
      console.warn('[API Client] NEXT_PUBLIC_PAYLOAD_URL not set, cannot convert relative media URL:', url)
      return url
    }
    return `${baseUrl.replace(/\/$/, '')}${url}`
  }
  
  // If no protocol and no leading slash, assume it's a relative path
  return url
}

