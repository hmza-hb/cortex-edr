import type { Metadata } from 'next'
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { LoadingScreen } from '@/components/ui/loading-screen'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: {
    default: 'Cortex EDR — Clean Code & Secure Apps Made Easy',
    template: '%s | Cortex EDR'
  },
  description: 'The easiest way to audit your code and find security bugs. Project Cortex helps everyone from solo creators to enterprise teams build better, more secure apps. Made with love by Hamza Hafeez.',
  keywords: [
    'Project Cortex',
    'Cortex EDR',
    'Cortex Security',
    'Code Audit App',
    'Find Security Bugs',
    'Hamza Hafeez',
    'Easy Code Security',
    'Vibe Coding Security',
    'AI Code Helper',
    'Clean Code Scanner',
    'Security for Everyone',
    'Check my code for bugs'
  ],
  authors: [{ name: 'Hamza Hafeez', url: 'https://github.com/hamza-hafeez82' }],
  creator: 'Hamza Hafeez',
  publisher: 'Hamza Hafeez',
  metadataBase: new URL('https://cortex-edr.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cortex-edr.com',
    title: 'Cortex EDR: The Helpful AI Security Auditor',
    description: 'Build with confidence. Use Cortex EDR to scan your project for bugs and security issues in seconds. Built by Hamza Hafeez.',
    siteName: 'Cortex EDR',
    images: [
      {
        url: '/assets/logo.png',
        width: 800,
        height: 800,
        alt: 'Cortex EDR Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cortex EDR — Simple & Powerful Code Security',
    description: 'Audit your code, fix vulnerabilities, and build faster. Created by Hamza Hafeez.',
    creator: '@hamza_hafeez',
    images: ['/assets/logo.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/assets/logo.png',
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Cortex EDR",
      "alternateName": ["Project Cortex", "Cortex Security", "Cortex"],
      "description": "An easy-to-use AI tool for auditing code and finding security vulnerabilities.",
      "applicationCategory": "Developer Tool",
      "operatingSystem": "All",
      "author": {
        "@type": "Person",
        "name": "Hamza Hafeez",
        "sameAs": [
          "https://github.com/hamza-hafeez82",
          "https://www.linkedin.com/in/hamza-hafeez"
        ]
      },
      "url": "https://cortex-edr.com",
      "screenshot": "https://cortex-edr.com/assets/bg-hero.png",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "ItemList",
      "name": "Site Links",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Check our Features",
          "url": "https://cortex-edr.com/features"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "View Pricing",
          "url": "https://cortex-edr.com/pricing"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Get Started (Login)",
          "url": "https://cortex-edr.com/login"
        }
      ]
    },
    {
      "@type": "Organization",
      "name": "Cortex EDR",
      "url": "https://cortex-edr.com",
      "logo": "https://cortex-edr.com/assets/logo.png",
      "founder": {
        "@type": "Person",
        "name": "Hamza Hafeez"
      }
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${jetbrains.variable} font-sans overflow-x-hidden selection:bg-indigo-500/30`}>
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          /* Premium Slim Scrollbar */
          .premium-scrollbar::-webkit-scrollbar {
            width: 5px;
            height: 5px;
          }
          .premium-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .premium-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(161, 161, 170, 0.1);
            border-radius: 20px;
            border: 1px solid transparent;
            background-clip: content-box;
          }
          .premium-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.4);
          }
          
          /* Hide scrollbar for Chrome, Safari and Opera */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          /* Hide scrollbar for IE, Edge and Firefox */
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}} />
        <LoadingScreen />
        {children}
      </body>
    </html>
  )
}
