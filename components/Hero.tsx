"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { richTextToHTML } from "@/lib/richText"

type HeroProps = {
  data: {
    headline: string
    subheadline: string | any // Can be string or richText
    cta: string
    image?: string
    stats?: { label: string; value: string }[]
  }
}

export default function Hero({ data }: HeroProps) {
  if (!data || !data.headline) {
    return null
  }

  const handleCTAClick = () => {
    const contactForm = document.getElementById("contact")
    contactForm?.scrollIntoView({ behavior: "smooth" })
  }

  const { headline, subheadline, cta, image, stats = [] } = data

  return (
    <section id="hero" className="bg-gradient-to-br from-white via-teal/5 to-white py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="inline-flex items-center gap-2 text-brand-teal font-medium text-sm md:text-base">
              <Sparkles className="w-5 h-5" />
              <span>AI-Powered Web Development</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight text-balance">
              {headline}
            </h1>

            <div 
              className="rich-text text-lg md:text-xl text-gray-600 leading-relaxed text-pretty"
              dangerouslySetInnerHTML={{ __html: richTextToHTML(subheadline) }}
            />

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Button
                onClick={handleCTAClick}
                size="lg"
                className="bg-brand-navy hover:bg-brand-navy/90 text-white px-8 py-6 text-lg font-semibold"
                aria-label="Μετάβαση στη φόρμα επικοινωνίας για να ξεκινήσετε"
              >
                {cta}
              </Button>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-brand-teal border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-brand-navy border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                </div>
                <span className="text-gray-600">100+ ικανοποιημένοι πελάτες</span>
              </div>
            </div>

            {/* Dynamic Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {stats.map((item, index) => (
                  <div key={index}>
                    <div className="text-2xl md:text-3xl font-bold text-brand-navy">
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Illustration */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-brand-navy/10 rounded-3xl" />

              {image && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={image}
                    alt={headline}
                    className="w-full h-full object-contain p-8"
                  />
                </div>
              )}

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-teal rounded-2xl opacity-20 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-brand-navy rounded-2xl opacity-20 blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

