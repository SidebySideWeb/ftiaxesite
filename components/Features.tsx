import { Clock, Euro, TrendingUp, Shield, Smartphone, Zap } from "lucide-react"
import { richTextToHTML } from "@/lib/richText"

type FeaturesProps = {
  data: {
    title: string
    subtitle: string | any // Can be string or richText
    items: {
      icon: string // we'll map this string to an icon below
      title: string
      description: string | any // Can be string or richText
    }[]
  }
}

const iconMap: Record<string, any> = {
  clock: Clock,
  euro: Euro,
  trendingUp: TrendingUp,
  shield: Shield,
  smartphone: Smartphone,
  zap: Zap,
}

export default function Features({ data }: FeaturesProps) {
  const { title, subtitle, items } = data

  return (
    <section
      id="features"
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-brand-navy/5 relative overflow-hidden"
    >
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-navy/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mb-4">
            {title}
          </h2>
          <div 
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: richTextToHTML(subtitle) }}
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((feature, index) => {
            const Icon = iconMap[feature.icon.toLowerCase()] || Zap

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-brand-teal/10 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-brand-teal" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-brand-navy mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <div 
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: richTextToHTML(feature.description) }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

