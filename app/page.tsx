import { headers } from "next/headers"
import { createClientWithTenant } from "@/lib/payload-client"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Process from "@/components/Process"
import ContactForm from "@/components/ContactForm"
import Footer from "@/components/Footer"

// Default fallback data (matches the YAML structure)
const defaultData = {
  header: {
    logo_text: "ftiaxesite.gr",
    menu: [
      { label: "Λειτουργίες", link: "features" },
      { label: "Διαδικασία", link: "process" },
    ],
    cta: {
      label: "Φτιάξε το site σου",
      link: "contact",
    },
  },
  hero: {
    headline: "Φτιάξε το site σου σε 48 ώρες — από 250€",
    subheadline: "Με τη δύναμη της Τεχνητής Νοημοσύνης, δημιουργούμε γρήγορα, οικονομικά και επαγγελματικά websites.",
    cta: "Ξεκίνα τώρα",
    image: "/modern-ai-website-development-illustration.jpg",
    stats: [
      { value: "48h", label: "Παράδοση" },
      { value: "250€", label: "Από" },
      { value: "AI", label: "Τεχνολογία" },
    ],
  },
  features: {
    title: "Γιατί να μας επιλέξεις",
    subtitle: "Όλα όσα χρειάζεσαι για να έχεις έτοιμο το website σου σε 48 ώρες",
    items: [
      {
        icon: "clock",
        title: "Παράδοση σε 48 ώρες",
        description: "Το website σου είναι έτοιμο μέσα σε δύο μέρες.",
      },
      {
        icon: "euro",
        title: "Από 250€",
        description: "Χαμηλό κόστος χωρίς κρυφές χρεώσεις.",
      },
      {
        icon: "trendingUp",
        title: "SEO & Analytics",
        description: "Έτοιμο για Google με ενσωματωμένο Tag Manager.",
      },
      {
        icon: "shield",
        title: "Cookie Consent",
        description: "Συμμόρφωση με GDPR και απόλυτη διαφάνεια.",
      },
      {
        icon: "smartphone",
        title: "Responsive Design",
        description: "Λειτουργεί άψογα σε κινητά, tablet και υπολογιστές.",
      },
      {
        icon: "zap",
        title: "AI Technology",
        description: "Χρησιμοποιούμε Τεχνητή Νοημοσύνη για γρήγορη ανάπτυξη.",
      },
    ],
  },
  process: {
    title: "Πώς δουλεύουμε",
    subtitle: "Από την ιδέα στην online παρουσία — απλά, γρήγορα και αποτελεσματικά.",
    steps: [
      {
        number: "01",
        icon: "fileText",
        title: "Συμπληρώνεις τη φόρμα",
        description: "Μας λες τι χρειάζεσαι.",
        color: "teal" as const,
      },
      {
        number: "02",
        icon: "wand2",
        title: "Δημιουργούμε το σχέδιο",
        description: "Χρησιμοποιούμε AI για να σχεδιάσουμε το website σου.",
        color: "navy" as const,
      },
      {
        number: "03",
        icon: "checkCircle2",
        title: "Παραδίδουμε σε 48 ώρες",
        description: "Παραλαμβάνεις έτοιμο site με SEO & Analytics.",
        color: "teal" as const,
      },
    ],
  },
  contact: {
    title: "Ξεκίνα τη κατασκευή της σελίδας σου σήμερα",
    subtitle: "Πες μας τι χρειάζεσαι — μίλησε το brief σου με ένα κλικ",
    form: {
      name: "Όνομα",
      email: "Email",
      phone: "Τηλέφωνο",
      voicePrompt: "Πάτησε το μικρόφωνο και πες μας για το project σου",
      voiceListening: "Σε ακούω... Μίλα τώρα!",
      voiceTranscript: "Αυτό που είπες:",
      submit: "Αποστολή",
    },
  },
  footer: {
    brand: {
      name: "ftiaxesite.gr",
      tagline: "AI Websites σε 48 Ώρες",
    },
    contact: {
      title: "Επικοινωνία",
      email: "info@ftiaxesite.gr",
      phone: "+30 210 1234567",
    },
    links: {
      title: "Χρήσιμα",
      items: [
        { label: "Όροι Χρήσης", href: "/terms" },
        { label: "Πολιτική Απορρήτου", href: "/privacy" },
      ],
    },
    copyright: "© 2025 ftiaxesite.gr – Κατασκευή Ιστοσελίδων με AI",
  },
}

export default async function Page() {
  const headersList = await headers()
  const hostname = headersList.get('host') || ''

  // Try to fetch from Payload CMS, fallback to default data
  let pageData = defaultData

  try {
    if (process.env.NEXT_PUBLIC_PAYLOAD_URL) {
      const client = createClientWithTenant(hostname)
      
      // Fetch home page from CMS
      const homePageResult = await client.getPage('home')
      const homePage = homePageResult.docs?.[0]

      if (homePage) {
        // Map CMS page data to component props
        // Use sections if available, otherwise fallback to default
        if (homePage.sections) {
          pageData = {
            header: homePage.sections.header || defaultData.header,
            hero: {
              headline: homePage.sections.hero?.headline || homePage.title || defaultData.hero.headline,
              subheadline: homePage.sections.hero?.subheadline || homePage.description || defaultData.hero.subheadline,
              cta: homePage.sections.hero?.cta || defaultData.hero.cta,
              image: homePage.sections.hero?.image 
                ? (typeof homePage.sections.hero.image === 'object' 
                    ? homePage.sections.hero.image.url 
                    : homePage.sections.hero.image)
                : (typeof homePage.featuredImage === 'object' 
                    ? homePage.featuredImage.url 
                    : homePage.featuredImage || defaultData.hero.image),
              stats: homePage.sections.hero?.stats || defaultData.hero.stats,
            },
            features: homePage.sections.features || defaultData.features,
            process: homePage.sections.process || defaultData.process,
            contact: homePage.sections.contact || defaultData.contact,
            footer: homePage.sections.footer || defaultData.footer,
          }
        } else {
          // Fallback for pages without sections (legacy structure)
          pageData = {
            ...defaultData,
            hero: {
              headline: homePage.title || defaultData.hero.headline,
              subheadline: homePage.description || defaultData.hero.subheadline,
              cta: defaultData.hero.cta,
              image: typeof homePage.featuredImage === 'object' 
                ? homePage.featuredImage.url 
                : homePage.featuredImage || defaultData.hero.image,
              stats: defaultData.hero.stats,
            },
          }
        }
      }
    }
  } catch (error) {
    // Fallback to default data if CMS fetch fails
    console.error('Failed to fetch page data from CMS:', error)
  }

  return (
    <main>
      <Hero data={pageData.hero} />
      <Features data={pageData.features} />
      <Process data={pageData.process} />
      <ContactForm data={pageData.contact} />
      <Footer data={pageData.footer} />
    </main>
  )
}
