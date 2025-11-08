import { headers } from "next/headers"
import { createClientWithTenant, getAbsoluteMediaUrl } from "@/lib/payload-client"
import { defaultHeaderData, defaultFooterData, mapHeaderContent, mapFooterContent } from "@/lib/content-mappers"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Process from "@/components/Process"
import ContactForm from "@/components/ContactForm"
import Footer from "@/components/Footer"

const defaultHero = {
  headline: "Φτιάξε το site σου σε 48 ώρες — από 250€",
  subheadline: "Με τη δύναμη της Τεχνητής Νοημοσύνης, δημιουργούμε γρήγορα, οικονομικά και επαγγελματικά websites.",
  cta: "Ξεκίνα τώρα",
  image: "/modern-ai-website-development-illustration.jpg",
  stats: [
    { value: "48h", label: "Παράδοση" },
    { value: "250€", label: "Από" },
    { value: "AI", label: "Τεχνολογία" },
  ],
}

const defaultFeatures = {
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
}

const defaultProcess = {
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
}

const defaultContact = {
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
}

export default async function Page() {
  const headersList = await headers()
  const hostname = headersList.get('host') || ''

  let headerData = defaultHeaderData
  let footerData = defaultFooterData
  let heroData = defaultHero
  let featuresData = defaultFeatures
  let processData = defaultProcess
  let contactData = defaultContact

  try {
    if (process.env.NEXT_PUBLIC_PAYLOAD_URL) {
      const client = createClientWithTenant(hostname)
      const homepage = await client.getPageBySlug('ftiaxesite-homepage', {
        params: {
          depth: 0,
        },
      })

      const content = (homepage as any)?.content || {}
      const sections = content.sections || {}
      const shared = content.shared || {}

      if (shared.headerFooterPageSlug) {
        const headerFooterPage = await client.getPageBySlug(shared.headerFooterPageSlug, {
          params: {
            depth: 0,
          },
        })

        const headerFooterContent = (headerFooterPage as any)?.content || {}
        headerData = mapHeaderContent(headerFooterContent.header)
        footerData = mapFooterContent(headerFooterContent.footer)
      }

      const cmsHero = sections.hero || {}
      heroData = {
        headline: cmsHero.headline || homepage?.title || defaultHero.headline,
        subheadline: cmsHero.subheadline || defaultHero.subheadline,
        cta: cmsHero.cta || defaultHero.cta,
        image: cmsHero.image
          ? getAbsoluteMediaUrl(typeof cmsHero.image === 'string' ? cmsHero.image : cmsHero.image?.url)
          : defaultHero.image,
        stats: Array.isArray(cmsHero.stats) && cmsHero.stats.length > 0 ? cmsHero.stats : defaultHero.stats,
      }

      const cmsFeatures = sections.features || {}
      featuresData =
        Array.isArray(cmsFeatures.items) && cmsFeatures.items.length > 0
          ? {
              title: cmsFeatures.title || defaultFeatures.title,
              subtitle: cmsFeatures.subtitle || defaultFeatures.subtitle,
              items: cmsFeatures.items,
            }
          : defaultFeatures

      const cmsProcess = sections.process || {}
      processData =
        Array.isArray(cmsProcess.steps) && cmsProcess.steps.length > 0
          ? {
              title: cmsProcess.title || defaultProcess.title,
              subtitle: cmsProcess.subtitle || defaultProcess.subtitle,
              steps: cmsProcess.steps,
            }
          : defaultProcess

      const cmsContact = sections.contact || {}
      contactData = {
        title: cmsContact.title || defaultContact.title,
        subtitle: cmsContact.subtitle || defaultContact.subtitle,
        form: {
          name: cmsContact.form?.name || defaultContact.form.name,
          email: cmsContact.form?.email || defaultContact.form.email,
          phone: cmsContact.form?.phone || defaultContact.form.phone,
          voicePrompt: cmsContact.form?.voicePrompt || defaultContact.form.voicePrompt,
          voiceListening: cmsContact.form?.voiceListening || defaultContact.form.voiceListening,
          voiceTranscript: cmsContact.form?.voiceTranscript || defaultContact.form.voiceTranscript,
          submit: cmsContact.form?.submit || defaultContact.form.submit,
        },
      }
    }
  } catch (error) {
    console.error('[Home Page] Failed to fetch page data from CMS:', error)
  }

  return (
    <main>
      <Hero data={heroData} />
      <Features data={featuresData} />
      <Process data={processData} />
      <ContactForm data={contactData} />
      <Footer data={footerData} />
    </main>
  )
}
