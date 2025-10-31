import { Metadata } from 'next'
import Link from 'next/link'
import './not-found.css'

export const metadata: Metadata = {
  title: '404 - Page Not Found | ftiaxesite.gr',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center px-4 py-16">
          {/* Animated 404 Face */}
          <div className="face-container mb-8">
            <svg 
              className="face" 
              viewBox="0 0 320 380" 
              width="320" 
              height="380"
              aria-label="A 404 becomes a face, looks to the sides, and blinks. The 4s slide up, the 0 slides down, and then a mouth appears."
            >
              <g
                fill="none"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="25"
              >
                <g className="face__eyes" transform="translate(0, 112.5)">
                  <g transform="translate(15, 0)">
                    <polyline className="face__eye-lid" points="37,0 0,120 75,120" />
                    <polyline className="face__pupil" points="55,120 55,155" strokeDasharray="35 35" />
                  </g>
                  <g transform="translate(230, 0)">
                    <polyline className="face__eye-lid" points="37,0 0,120 75,120" />
                    <polyline className="face__pupil" points="55,120 55,155" strokeDasharray="35 35" />
                  </g>
                </g>
                <rect className="face__nose" rx="4" ry="4" x="132.5" y="112.5" width="55" height="155" />
                <g strokeDasharray="102 102" transform="translate(65, 334)">
                  <path className="face__mouth-left" d="M 0 30 C 0 30 40 0 95 0" strokeDashoffset="-102" />
                  <path className="face__mouth-right" d="M 95 0 C 150 0 190 30 190 30" strokeDashoffset="102" />
                </g>
              </g>
            </svg>
          </div>

          {/* Text Content */}
          <div className="max-w-md mx-auto">
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Η σελίδα που αναζητάτε ενδέχεται να έχει αφαιρεθεί, να έχει αλλάξει όνομα ή να είναι προσωρινά μη διαθέσιμη.
            </p>
            
            {/* Action Button */}
            <div className="flex justify-center">
              <Link 
                href="/"
                className="inline-block px-6 py-3 bg-brand-teal hover:bg-brand-teal/90 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Επιστροφή στην Αρχική
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

