import { headers } from "next/headers"
import { createClientWithTenant, getAbsoluteMediaUrl } from "@/lib/payload-client"
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
      const homePageResult = await client.getPage('home')
      const homePage = homePageResult.docs?.[0]

      if (homePage && homePage.sections) {
        // Merge CMS data with defaults to ensure all required fields are present
        const cmsHero = homePage.sections.hero
        const cmsFeatures = homePage.sections.features
        const cmsProcess = homePage.sections.process
        const cmsContact = homePage.sections.contact

        pageData = {
          header: homePage.sections.header || defaultData.header,
          hero: {
            headline: cmsHero?.headline || homePage.title || defaultData.hero.headline,
            subheadline: cmsHero?.subheadline || homePage.description || defaultData.hero.subheadline,
            cta: cmsHero?.cta || defaultData.hero.cta,
            image: cmsHero?.image 
              ? (typeof cmsHero.image === 'object' && cmsHero.image?.url
                  ? getAbsoluteMediaUrl(cmsHero.image.url)
                  : getAbsoluteMediaUrl(typeof cmsHero.image === 'string' ? cmsHero.image : ''))
              : (typeof homePage.featuredImage === 'object' && homePage.featuredImage?.url
                  ? getAbsoluteMediaUrl(homePage.featuredImage.url)
                  : getAbsoluteMediaUrl(typeof homePage.featuredImage === 'string' ? homePage.featuredImage : '') || defaultData.hero.image),
            stats: cmsHero?.stats && Array.isArray(cmsHero.stats) && cmsHero.stats.length > 0 
              ? cmsHero.stats 
              : defaultData.hero.stats,
          },
          // Only use CMS features if it has items array, otherwise use defaults
          features: (cmsFeatures?.items && Array.isArray(cmsFeatures.items) && cmsFeatures.items.length > 0)
            ? {
                title: cmsFeatures.title || defaultData.features.title,
                subtitle: cmsFeatures.subtitle || defaultData.features.subtitle,
                items: cmsFeatures.items,
              }
            : defaultData.features,
          // Only use CMS process if it has steps array, otherwise use defaults
          process: (cmsProcess?.steps && Array.isArray(cmsProcess.steps) && cmsProcess.steps.length > 0)
            ? {
                title: cmsProcess.title || defaultData.process.title,
                subtitle: cmsProcess.subtitle || defaultData.process.subtitle,
                steps: cmsProcess.steps,
              }
            : defaultData.process,
          // Merge contact data with defaults
          contact: cmsContact
            ? {
                title: cmsContact.title || defaultData.contact.title,
                subtitle: cmsContact.subtitle || defaultData.contact.subtitle,
                form: {
                  name: cmsContact.form?.name || defaultData.contact.form.name,
                  email: cmsContact.form?.email || defaultData.contact.form.email,
                  phone: cmsContact.form?.phone || defaultData.contact.form.phone,
                  voicePrompt: cmsContact.form?.voicePrompt || defaultData.contact.form.voicePrompt,
                  voiceListening: cmsContact.form?.voiceListening || defaultData.contact.form.voiceListening,
                  voiceTranscript: cmsContact.form?.voiceTranscript || defaultData.contact.form.voiceTranscript,
                  submit: cmsContact.form?.submit || defaultData.contact.form.submit,
                },
              }
            : defaultData.contact,
          footer: homePage.sections.footer || defaultData.footer,
        }
      }
    }
  } catch (error) {
    // Fallback to default data if CMS fetch fails
    console.error('[Home Page] Failed to fetch page data from CMS:', error)
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
