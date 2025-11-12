export const defaultHeaderData = {
  logo_text: 'ftiaxesite.gr',
  menu: [
    { label: 'Χαρακτηριστικά', link: 'features' },
    { label: 'Διαδικασία', link: 'process' },
  ],
  cta: {
    label: 'Φτιάξε το site σου',
    link: 'contact',
  },
}

export const defaultFooterData = {
  brand: {
    name: 'ftiaxesite.gr',
    tagline: 'AI Websites σε 48 Ώρες',
  },
  contact: {
    title: 'Επικοινωνία',
    email: 'info@ftiaxesite.gr',
    phone: '+30 210 1234567',
  },
  links: {
    title: 'Χρήσιμα',
    items: [
      { label: 'Όροι Χρήσης', href: '/terms' },
      { label: 'Πολιτική Απορρήτου', href: '/privacy' },
    ],
  },
  copyright: '© 2025 ftiaxesite.gr – Κατασκευή Ιστοσελίδων με AI',
}

export const defaultFeaturesData = {
  title: 'Γιατί να μας επιλέξεις',
  subtitle: 'Όλα όσα χρειάζεσαι για να έχεις έτοιμο το website σου σε 48 ώρες',
  items: [
    {
      icon: 'clock',
      title: 'Παράδοση σε 48 ώρες',
      description: 'Το website σου είναι έτοιμο μέσα σε δύο μέρες.',
    },
    {
      icon: 'euro',
      title: 'Από 250€',
      description: 'Χαμηλό κόστος χωρίς κρυφές χρεώσεις.',
    },
    {
      icon: 'trendingUp',
      title: 'SEO & Analytics',
      description: 'Έτοιμο για Google με ενσωματωμένο Tag Manager.',
    },
    {
      icon: 'shield',
      title: 'Cookie Consent',
      description: 'Συμμόρφωση με GDPR και απόλυτη διαφάνεια.',
    },
    {
      icon: 'smartphone',
      title: 'Responsive Design',
      description: 'Λειτουργεί άψογα σε κινητά, tablet και υπολογιστές.',
    },
    {
      icon: 'zap',
      title: 'AI Technology',
      description: 'Χρησιμοποιούμε Τεχνητή Νοημοσύνη για γρήγορη ανάπτυξη.',
    },
  ],
} as const

export const defaultProcessData = {
  title: 'Πώς δουλεύουμε',
  subtitle: 'Από την ιδέα στην online παρουσία — απλά, γρήγορα και αποτελεσματικά.',
  steps: [
    {
      number: '01',
      icon: 'fileText',
      title: 'Συμπληρώνεις τη φόρμα',
      description: 'Μας λες τι χρειάζεσαι.',
      color: 'teal' as const,
    },
    {
      number: '02',
      icon: 'wand2',
      title: 'Δημιουργούμε το σχέδιο',
      description: 'Χρησιμοποιούμε AI για να σχεδιάσουμε το website σου.',
      color: 'navy' as const,
    },
    {
      number: '03',
      icon: 'checkCircle2',
      title: 'Παραδίδουμε σε 48 ώρες',
      description: 'Παραλαμβάνεις έτοιμο site με SEO & Analytics.',
      color: 'teal' as const,
    },
  ],
} as const

const isLexicalState = (value: any): value is { root: { children?: any[] } } =>
  typeof value === 'object' && value !== null && 'root' in value

export function richTextToPlainText(value: any): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (!isLexicalState(value)) return ''

  const parts: string[] = []

  const visitNodes = (nodes: any[] = []) => {
    nodes.forEach((node, index) => {
      if (!node) return
      const type = node.type

      if (type === 'linebreak') {
        parts.push('\n')
        return
      }

      if (type === 'paragraph') {
        const lengthBefore = parts.length
        visitNodes(node.children ?? [])
        if (index < nodes.length - 1 && parts.length > lengthBefore) {
          parts.push('\n')
        }
        return
      }

      if (type === 'text') {
        parts.push(node.text ?? '')
        return
      }

      if (Array.isArray(node.children)) {
        visitNodes(node.children)
      }
    })
  }

  visitNodes(value.root?.children ?? [])

  return parts.join('').replace(/\n{3,}/g, '\n\n').trim()
}

export function mapHeaderContent(content: any) {
  if (!content) {
    return defaultHeaderData
  }

  return {
    logo_text: content.logoText || content.logo_text || defaultHeaderData.logo_text,
    menu: Array.isArray(content.menu) && content.menu.length > 0 ? content.menu : defaultHeaderData.menu,
    cta: {
      label: content.cta?.label || defaultHeaderData.cta.label,
      link: content.cta?.link || defaultHeaderData.cta.link,
    },
  }
}

export function mapFooterContent(content: any) {
  if (!content) {
    return defaultFooterData
  }

  return {
    brand: {
      name: content.brand?.name || defaultFooterData.brand.name,
      tagline: content.brand?.tagline || defaultFooterData.brand.tagline,
    },
    contact: {
      title: content.contact?.title || defaultFooterData.contact.title,
      email: content.contact?.email || defaultFooterData.contact.email,
      phone: content.contact?.phone || defaultFooterData.contact.phone,
    },
    links: {
      title: content.links?.title || defaultFooterData.links.title,
      items:
        Array.isArray(content.links?.items) && content.links.items.length > 0
          ? content.links.items
          : defaultFooterData.links.items,
    },
    copyright: content.copyright || defaultFooterData.copyright,
  }
}

const mapFeatureItems = (items: any[]) => {
  if (!Array.isArray(items) || items.length === 0) {
    return defaultFeaturesData.items
  }

  return items.map((item, index) => ({
    ...item,
    description:
      richTextToPlainText(item?.description) || defaultFeaturesData.items[index]?.description || '',
  }))
}

const mapProcessSteps = (steps: any[]) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return defaultProcessData.steps
  }

  return steps.map((step, index) => ({
    ...step,
    description: richTextToPlainText(step?.description) || defaultProcessData.steps[index]?.description || '',
  }))
}
