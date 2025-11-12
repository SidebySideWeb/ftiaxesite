import Header from "@/components/Header"
import GoogleTagManager from "@/components/GoogleTagManager"
import { createClientWithTenant } from "@/lib/payload-client"
import { defaultHeaderData, mapHeaderContent } from "@/lib/content-mappers"
import type { Metadata } from "next"
import { Roboto, Roboto_Condensed } from "next/font/google"
import { headers } from "next/headers"
import "./globals.css"

const roboto = Roboto({
  subsets: ['latin', 'greek'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
})

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin', 'greek'],
  weight: ['300', '700'],
  variable: '--font-roboto-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "ftiaxesite.gr – Website σε 48 Ώρες από 250€",
  description: "AI-powered websites, SEO-ready, σε 48 ώρες.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const hostname = headersList.get('host') || ''

  let headerData = defaultHeaderData

  try {
    if (process.env.NEXT_PUBLIC_PAYLOAD_URL) {
      const client = createClientWithTenant()
      const headerFooterPage = await client.getPageBySlug('header-footer-ftiaxesite', {
        params: {
          depth: 0,
        },
      })

      const cmsHeader = (headerFooterPage as any)?.content?.header
      headerData = mapHeaderContent(cmsHeader)
    }
  } catch (error) {
    console.error('[Layout] Failed to fetch header data from CMS:', error)
  }

  return (
    <html lang="el" className={`${roboto.variable} ${robotoCondensed.variable}`}>
      <body className="font-sans antialiased">
        <GoogleTagManager />
        <Header data={headerData} />
        {children}
      </body>
    </html>
  )
}
