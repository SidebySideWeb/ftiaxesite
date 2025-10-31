import { FileText, Wand2, CheckCircle2 } from "lucide-react"
import { richTextToHTML } from "@/lib/richText"

type ProcessProps = {
  data: {
    title: string
    subtitle: string | any // Can be string or richText
    steps: {
      number: string
      icon: string
      title: string
      description: string | any // Can be string or richText
      color?: "teal" | "navy"
    }[]
  }
}

const iconMap: Record<string, any> = {
  fileText: FileText,
  wand2: Wand2,
  checkCircle2: CheckCircle2,
}

const colorMap = {
  teal: {
    bg: "bg-brand-teal/10",
    border: "border-brand-teal",
    iconBg: "bg-brand-teal",
    numberBg: "bg-brand-teal",
    hoverBg: "hover:bg-brand-teal/20",
  },
  navy: {
    bg: "bg-brand-navy/10",
    border: "border-brand-navy",
    iconBg: "bg-brand-navy",
    numberBg: "bg-brand-navy",
    hoverBg: "hover:bg-brand-navy/20",
  },
}

export default function Process({ data }: ProcessProps) {
  const { title, subtitle, steps } = data

  return (
    <section id="process" className="py-16 md:py-24 bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-teal/5 to-transparent -z-10" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            {title}
          </h2>
          <div 
            className="rich-text text-lg text-gray-600 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: richTextToHTML(subtitle) }}
          />
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, index) => {
              const Icon = iconMap[step.icon.toLowerCase()] || FileText
              const colors = colorMap[step.color || "teal"]

              return (
                <div key={index} className="relative">
                  <div
                    className={`relative ${colors.bg} ${colors.hoverBg} border-2 ${colors.border} rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 h-full flex flex-col items-center text-center`}
                  >
                    <div
                      className={`${colors.numberBg} text-white px-4 py-1 rounded-full text-sm font-bold mb-6`}
                    >
                      ΒΗΜΑ {step.number}
                    </div>

                    {/* Icon circle */}
                    <div
                      className={`w-20 h-20 rounded-full ${colors.iconBg} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-brand-navy mb-3">
                      {step.title}
                    </h3>
                    <div 
                      className="rich-text text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: richTextToHTML(step.description) }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

