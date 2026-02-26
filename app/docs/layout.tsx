import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import { Shield, Brain, Github } from 'lucide-react'
import 'nextra-theme-docs/style.css'
import Link from 'next/link'

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
    const pageMap = await getPageMap('/docs')

    return (
        <Layout
            navbar={
                <Navbar
                    logo={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={20} style={{ color: '#818cf8' }} />
                            <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                                CortexEDR <span style={{ color: '#818cf8', fontSize: '0.65rem', fontWeight: 600 }}>DOCS</span>
                            </span>
                        </div>
                    }
                    projectLink="https://github.com/hamza-hafeez82/cortex-edr"
                />
            }
            footer={
                <Footer>
                    <span>
                        © {new Date().getFullYear()}{' '}
                        <a href="https://cortex-edr.com" target="_blank" style={{ fontWeight: 'bold' }}>
                            CortexEDR
                        </a>
                        . Elite Codebase Defense. Developed by{' '}
                        <a href="https://github.com/hamza-hafeez82" target="_blank" style={{ fontWeight: 'bold' }}>
                            Hamza Hafeez
                        </a>
                    </span>
                </Footer>
            }
            pageMap={pageMap}
            docsRepositoryBase="https://github.com/hamza-hafeez82/cortex-edr/tree/main"
            editLink="Edit this page on GitHub"
            sidebar={{
                defaultMenuCollapseLevel: 1,
                toggleButton: true,
            }}
            nextThemes={{
                defaultTheme: 'dark',
                forcedTheme: 'dark'
            }}
        >
            {children}
        </Layout>
    )
}
