import React from 'react'
import { Shield } from 'lucide-react'

const config = {
    logo: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={24} style={{ color: '#818cf8' }} />
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.025em' }}>CortexEDR Docs</span>
        </div>
    ),
    project: {
        link: 'https://github.com/hamza-hafeez82/cortex-edr',
    },
    chat: {
        link: 'https://discord.gg/cortex-edr',
    },
    docsRepositoryBase: 'https://github.com/hamza-hafeez82/cortex-edr/tree/main',
    footer: {
        text: (
            <span>
                © {new Date().getFullYear()}{' '}
                <a href="https://cortex-edr.com" target="_blank" style={{ fontWeight: 'bold' }}>
                    CortexEDR
                </a>
                . Elite Codebase Defense.
            </span>
        ),
    },
    useNextSeoProps() {
        return {
            titleTemplate: '%s – CortexEDR'
        }
    },
    primaryHue: 238, // matches indigo
}

export default config
