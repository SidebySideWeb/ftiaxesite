import { Mail, Phone, Globe } from "lucide-react"
import Link from "next/link"

type FooterProps = {
  data: {
    brand: {
      name: string
      tagline: string
    }
    contact: {
      title: string
      email: string
      phone: string
    }
    links: {
      title: string
      items: { label: string; href: string }[]
    }
    copyright: string
  }
}

export default function Footer({ data }: FooterProps) {
  const { brand, contact, links, copyright } = data

  return (
    <footer className="bg-brand-navy text-white py-16">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Globe className="h-6 w-6 text-brand-teal" />
              <h3 className="text-xl font-bold">{brand.name}</h3>
            </div>
            <p className="text-gray-300 text-sm">{brand.tagline}</p>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4 text-brand-teal">{contact.title}</h4>
            <div className="space-y-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-brand-teal transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-brand-teal transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                {contact.phone}
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4 text-brand-teal">{links.title}</h4>
            <ul className="space-y-2">
              {links.items.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-brand-teal transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}

