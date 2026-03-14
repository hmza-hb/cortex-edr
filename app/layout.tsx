import type { Metadata } from 'next'
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google'
import AuthProvider from '@/components/auth/SessionProvider'
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
    default: 'Cortex EDR',
    template: '%s | Cortex EDR'
  },
  description: 'Scan your codebase for security vulnerabilities in seconds. Cortex EDR uses a 7-agent AI pipeline for deep-pass code intelligence, automated vulnerability detection, and actionable fix suggestions. Free to start.',
  keywords: [
    'Cortex EDR',
    'code security scanner',
    'AI vulnerability detection',
    'code audit tool',
    'security analysis platform',
    'OWASP scanner',
    'static code analysis',
    'AI code review',
    'vulnerability scanner',
    'application security',
    'DevSecOps',
    'code security audit',
    'automated security testing',
    'GitHub security scanner'
  ],
  authors: [{ name: 'Hamza Hafeez', url: 'https://github.com/hamza-hafeez82' }],
  creator: 'Cortex EDR',
  publisher: 'Cortex EDR',
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
    title: 'Cortex EDR | AI-Powered Code Security & Vulnerability Scanner',
    description: 'Scan your codebase for security vulnerabilities in seconds. 7-agent AI pipeline for deep-pass code intelligence and automated vulnerability detection. Free to start.',
    siteName: 'Cortex EDR',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cortex EDR — AI-Powered Code Security Scanner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cortex EDR | AI-Powered Code Security & Vulnerability Scanner',
    description: 'Scan your codebase for security vulnerabilities in seconds. 7-agent AI pipeline for deep-pass code intelligence. Free to start.',
    creator: '@hamza_hafeez',
    images: ['/assets/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "Cortex EDR",
      "alternateName": ["CortexEDR", "Cortex Security", "Cortex"],
      "url": "https://cortex-edr.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://cortex-edr.com/docs?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "name": "Cortex EDR",
      "url": "https://cortex-edr.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cortex-edr.com/assets/logo.png",
        "width": 512,
        "height": 512
      },
      "image": "https://cortex-edr.com/assets/og-image.png",
      "description": "AI-powered code security and vulnerability scanning platform. Scan your codebase with a 7-agent AI pipeline for deep-pass intelligence.",
      "founder": {
        "@type": "Person",
        "name": "Hamza Hafeez",
        "sameAs": [
          "https://github.com/hamza-hafeez82",
          "https://www.linkedin.com/in/hamza-hafeez"
        ]
      },
      "sameAs": [
        "https://github.com/hamza-hafeez82/cortex-edr"
      ]
    },
    {
      "@type": "WebApplication",
      "name": "Cortex EDR",
      "description": "AI-powered code security scanner with 7-agent pipeline for deep vulnerability detection, automated fix suggestions, and comprehensive security reports.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web",
      "url": "https://cortex-edr.com",
      "screenshot": "https://cortex-edr.com/assets/og-image.png",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "description": "Free tier available with unlimited public repo scanning"
      },
      "featureList": [
        "7-Agent AI Security Pipeline",
        "OWASP Top 10 Detection",
        "Automated Fix Suggestions",
        "PDF Security Reports",
        "Real-time Scan Visualization",
        "AI Security Chat Advisor",
        "Multi-language Support",
        "GitHub Integration"
      ]
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Features",
      "description": "Explore all Cortex EDR security scanning capabilities and AI-powered features.",
      "url": "https://cortex-edr.com/features"
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Pricing",
      "description": "Compare Cortex EDR plans — Scout, Sentinel, Guardian, and Fortress tiers.",
      "url": "https://cortex-edr.com/pricing"
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Documentation",
      "description": "Guides, API reference, and tutorials for Cortex EDR.",
      "url": "https://cortex-edr.com/docs"
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Get Started",
      "description": "Sign up and start scanning your code for vulnerabilities. Free to start.",
      "url": "https://cortex-edr.com/auth"
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Cortex Chat",
      "description": "AI security advisor — ask questions about your codebase vulnerabilities.",
      "url": "https://cortex-edr.com/chat"
    },
    {
      "@type": "SiteNavigationElement",
      "name": "Support",
      "description": "Get help with Cortex EDR — FAQ, troubleshooting, and contact.",
      "url": "https://cortex-edr.com/support"
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}
