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
