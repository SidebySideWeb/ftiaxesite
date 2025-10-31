"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

type HeaderProps = {
  data: {
    logo_text: string
    menu: { label: string; link: string }[]
    cta: { label: string; link: string }
  }
}

export default function Header({ data }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-brand-navy" />
              <span className="font-bold text-lg text-brand-navy">
                {data.logo_text}
              </span>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {data.menu.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.link)}
                  className="text-base font-medium text-gray-700 transition-colors hover:text-brand-teal"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <Button
              onClick={() => scrollToSection(data.cta.link)}
              className="hidden md:inline-flex bg-brand-teal hover:bg-brand-teal/90 text-white font-semibold"
            >
              {data.cta.label}
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-2">
        <Button
          onClick={() => scrollToSection(data.cta.link)}
          className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white font-semibold shadow-lg py-6 text-base rounded-none"
        >
          {data.cta.label}
        </Button>
      </div>
    </>
  )
}

