
<div align="center">

# CortexEDR

![CortexEDR Banner](https://img.shields.io/badge/CortexEDR-AI%20Powered%20Security-purple?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnoiIGZpbGw9IiNhODU1ZjciLz48L3N2Zz4=)


**AI-Powered Code Analysis & Security Intelligence Platform**

*Deep contextual analysis that goes beyond syntax—understanding intent, logic flows, and architectural boundaries.*

[ Live ](https://www.cortex-edr.com) • [ Documentation](#documentation) • [ Community](https://github.com/yourusername/cortex-edr/discussions) • [ Report Bug](https://github.com/yourusername/cortex-edr/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features-deep-dive)
- [Pricing Tiers](#pricing-tiers)
- [Security](#security)
- [Support](#support)

---

##  Overview

**CortexEDR** is a next-generation, AI-powered code analysis and security intelligence platform designed for modern development teams. Unlike traditional static analysis tools that rely on pattern matching, CortexEDR leverages advanced AI models (Claude sonnet 4, GPT 4o, Gemini 1.5 Pro) to perform **deep contextual analysis** of your codebase.

### What Makes CortexEDR Different?

- **Semantic Understanding**: Goes beyond syntax to understand code intent, logic flows, and architectural patterns
- **Multi-Layer Analysis**: Analyzes code across 4 specialized intelligence layers (Security, Architecture, Technical Debt, AI-Specific)
- **Agentic Scanning**: Deploys 7 specialized AI agents for comprehensive production-grade analysis
- **Actionable Insights**: Provides not just problems, but execution-ready AI prompts to fix them
- **Enterprise-Ready**: Built with scalability, security, and compliance in mind

### Use Cases

- **Security Audits**: Detect OWASP Top 10 vulnerabilities, exposed secrets, and injection vectors
- **Code Quality**: Identify logic duplication, complexity hotspots, and naming inconsistencies
- **Technical Debt**: Track TODOs, deprecated dependencies, and performance anti-patterns
- **AI Code Review**: Detect AI-generated code issues, hallucinations, and over-engineering
- **Compliance**: Ensure adherence to security standards and best practices

---

##  Key Features

###  Security Layer
- **Injection Mitigation**: Real-time detection of SQLi, XSS, and CSRF vulnerabilities
- **Identity Flows**: Comprehensive authentication and authorization logic audits
- **Secret Synthesis**: Automated detection of exposed API keys and credentials
- **Dependency Graph**: Deep analysis of insecure or compromised packages
- **Encryption Enforcer**: Verification of cryptographic standards
- **OWASP Compliance**: Native alignment with Top 10 security standards

###  Architecture Layer
- **Logic Duplication**: Identification of redundant code and clones
- **Complexity Metrics**: Cyclomatic complexity and cognitive load analysis
- **Naming Protocols**: Enforcement of standardized conventions
- **Error Gaps**: Detection of missing exception handlers
- **Edge Case Logic**: Predictive analysis of unhandled states
- **Coverage Intelligence**: Real-time test coverage tracking

###  Technical Debt Layer
- **Static Indicators**: Detection of hard-coded values and magic numbers
- **Legacy Tracking**: Identification of deprecated dependencies
- **System TODOs**: Comprehensive indexing of FIXME markers
- **Performance Anti-Patterns**: Detection of inefficient operations
- **Memory Hygiene**: Predictive leak detection
- **Resource Leaks**: Identification of unclosed handles

###  AI-Specific Layer
- **Agent Over-Engineering**: Detection of unnecessary AI-generated abstractions
- **Style Uniformity**: Enforcement of consistent patterns in hybrid codebases
- **Redundancy Filter**: Removal of overlapping AI-generated logic
- **Missing Boundaries**: Detection of absent safety gates
- **Incomplete Triggers**: Identification of partial implementations
- **Hallucination Logic**: Filtering of functionally invalid AI code

###  User Experience
- **Interactive Terminal Demo**: Live code analysis visualization
- **Agentic Scanning VFX**: Real-time agent activity visualization
- **Comprehensive Reports**: Detailed PDF reports with fix suggestions
- **Delta Tracking**: Compare scans to track improvements
- **Team Collaboration**: Multi-seat support for enterprise teams

---

##  Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type-safe development |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Framer Motion** | 12.34.0 | Animation library |
| **Lucide React** | 0.564.0 | Icon library |
| **Radix UI** | Latest | Accessible component primitives |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js API Routes** | 16.1.6 | RESTful API endpoints |
| **Supabase** | 2.95.3 | Backend-as-a-Service |
| **PostgreSQL** | Latest | Primary database |
| **Supabase Auth** | 0.8.0 | Authentication & authorization |

### AI & Analysis
| Technology | Purpose |
|-----------|---------|
| **Claude sonnet 4, GPT 4o, Gemini 1.5 Pro** | Production AI analysis engine |
| **Custom Agents** | 7 specialized analysis agents |

### DevOps & Deployment
| Technology | Purpose |
|-----------|---------|
| **Vercel** | Frontend hosting |
| **Supabase Cloud** | Database & auth hosting |
| **GitHub Actions** | CI/CD pipeline |
| **ESLint** | Code linting |


## Core Features Deep Dive

### 1. Authentication System
### 2. Agentic Scanning Engine

The platform deploys 7 specialized AI agents:

1. **Security Agent**: OWASP Top 10 vulnerability detection
2. **Architecture Agent**: Design pattern analysis
3. **Quality Agent**: Code quality metrics
4. **Debt Agent**: Technical debt tracking
5. **AI Agent**: AI-generated code analysis
6. **Performance Agent**: Performance bottleneck detection
7. **Compliance Agent**: Regulatory compliance checks

### 3. Interactive Terminal Demo

Live code analysis demonstration with:
- Real-time syntax highlighting
- Animated scanning process
- Issue detection visualization
- Fix suggestion display

### 4. Dashboard

Protected dashboard with:
- Scan history
- Repository management
- Issue tracking
- Team collaboration
- Analytics and metrics

### 5. Pricing & Subscription

Four-tier pricing model:
- **Scout**: Free tier for public repos
- **Sentinel**: Professional tier ($9/mo)
- **Guardian**: Team tier ($29/mo)
- **Fortress**: Enterprise (custom pricing)

**NOTE**: These pricing are set low for the initial 100 user aquisition.. 

---

##  Pricing Tiers

| Feature | Scout (Free) | Sentinel ($9/mo) | Guardian ($29/mo) | Fortress (Custom) |
|---------|-------------|------------------|-------------------|-------------------|
| **Monthly Scans** | 1 | 10 | Unlimited | Unlimited |
| **Repo Size** | <5k lines | <50k lines | <200k lines | Custom |
| **History Retention** | 7 days | 30 days | Forever | Forever |
| **Security Analysis** | Basic | Complete | Complete | Custom Rules |
| **Architecture Analysis** | ❌ | ✅ | ✅ | ✅ |
| **Fix Prompts** | ❌ | ✅ | ✅ | Custom Models |
| **PDF Reports** | ❌ | ✅ | ✅ | ✅ |
| **Team Access** | ❌ | ❌ | 3 seats | Unlimited |
| **Support** | Community | Email (48h) | Priority (24h) | Dedicated |
| **CVE Tracking** | ❌ | ❌ | ✅ | ✅ |
| **Custom Integrations** | ❌ | ❌ | ❌ | ✅ |

---
##  Security

CortexEDR takes security seriously. Here's how we protect your data:

### Data Protection
- **Encryption at Rest**: All data encrypted in PostgreSQL
- **Encryption in Transit**: TLS 1.3 for all connections
- **Row-Level Security**: PostgreSQL RLS for data isolation
- **API Key Rotation**: Regular rotation of service keys

### Authentication
- **OAuth 2.0**: Secure GitHub authentication
- **JWT Tokens**: Short-lived access tokens
- **Refresh Tokens**: Secure token refresh mechanism
- **Session Management**: Automatic session expiration

### Code Security
- **No Code Storage**: We never store your source code
- **Temporary Analysis**: Code analyzed in memory only
- **Secure Deletion**: Immediate cleanup after analysis
- **Audit Logs**: Complete audit trail of all scans

### Compliance
- **GDPR Compliant**: Full data privacy compliance
- **SOC 2 Type II**: Security controls certification (in progress)
- **OWASP Top 10**: Protection against common vulnerabilities
- **Regular Audits**: Quarterly security assessments

### Reporting Security Issues

If you discover a security vulnerability, please email us at:
**security@cortex-edr.com**


### Professional Support

- **Email**: support@cortex-edr.com
- **Priority Support**: Available for Sentinel tier and above
- **Enterprise Support**: Dedicated support for Fortress tier

### Documentation

- **Full Documentation**: [docs.cortex-edr.com](https://docs.cortex-edr.com) (Coming soon)
- **Video Tutorials**: [YouTube Channel](https://youtube.com/@cortex-edr) (Coming soon)

---

## Acknowledgments

CortexEDR is built By Hamza Hafeez, with amazing open-source technologies:

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
- [Framer Motion](https://www.framer.com/motion/) - Animation Library
- [Radix UI](https://www.radix-ui.com/) - Accessible Component Primitives
- [Lucide Icons](https://lucide.dev/) - Beautiful Icon Library
- [Google Gemini](https://ai.google.dev/) - Advanced AI Models

---


<div align="center">

**Built with ❤️ by Hamza Hafeez**

[Website](https://www.cortex-edr.com) • [Instagram](https://instagram.com/hamza.hafeez82) • [LinkedIn](https://linkedin.com/in/hamza-hafeez82)

⭐ **Join the waitlist!**, it helps!

</div>
