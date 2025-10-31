import Header from "@/components/Header"
import GoogleTagManager from "@/components/GoogleTagManager"
import { createClientWithTenant } from "@/lib/payload-client"
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
  weight: ['300', '400', '700'],
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
  // Fetch header data from Payload CMS
  const headersList = await headers()
  const hostname = headersList.get('host') || ''
  
  let headerData = {
    logo_text: "ftiaxesite.gr",
    menu: [
      { label: "Λειτουργίες", link: "features" },
      { label: "Διαδικασία", link: "process" },
    ],
    cta: {
      label: "Φτιάξε το site σου",
      link: "contact",
    },
  }

  // Try to fetch header from CMS home page
  try {
    if (process.env.NEXT_PUBLIC_PAYLOAD_URL) {
      const client = createClientWithTenant(hostname)
      const homePageResult = await client.getPage('home')
      const homePage = homePageResult.docs?.[0]
      
      if (homePage?.sections?.header) {
        headerData = homePage.sections.header
      }
    }
  } catch (error) {
    // Fallback to default data if CMS is not available
    console.error('Failed to fetch header data from CMS:', error)
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
