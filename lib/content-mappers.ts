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
    return defaultFeatures.items
  }

  return items.map((item, index) => ({
    ...item,
    description:
      richTextToPlainText(item?.description) || defaultFeatures.items[index]?.description || '',
  }))
}

const mapProcessSteps = (steps: any[]) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return defaultProcess.steps
  }

  return steps.map((step, index) => ({
    ...step,
    description: richTextToPlainText(step?.description) || defaultProcess.steps[index]?.description || '',
  }))
}
