<div align="center">

<img src="https://img.shields.io/badge/CortexEDR-AI%20Powered%20Security-purple?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnoiIGZpbGw9IiNhODU1ZjciLz48L3N2Zz4=" alt="Cortex EDR Logo" />

# Cortex EDR
### **Deep Contextual Analysis & Agentic Intelligence Platform**

*Next-generation code security and architectural intelligence powered by an 8-agent neural pipeline.*

[![Website](https://img.shields.io/badge/Website-cortex--edr.com-purple?style=flat-square)](https://www.cortex-edr.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[ Live Demo ](https://www.cortex-edr.com) • [ Documentation ](#documentation) • [ Report Bug ](https://github.com/hamza-hafeez82/cortex-edr/issues)

</div>

---

## 🚀 Overview

**Cortex EDR** is an AI-native security intelligence platform designed to understand code as deeply as a senior engineer. While traditional tools look for patterns, Cortex performs **Semantic Neural Scans** to understand intent, map architectural boundaries, and identify logic-level vulnerabilities.

Built for the modern enterprise, Cortex leverages a sophisticated **8-Agent Pipeline** to provide comprehensive analysis across security, quality, architecture, and technical debt.

---

## 🧠 The Agentic Pipeline

Cortex deploys a fleet of specialized AI agents, each focused on a specific layer of your codebase's health.

| Agent | Module | Description |
| :--- | :--- | :--- |
| **Agent 0** | `Clone` | Securely retrieves and prepares the repository for analysis. |
| **Agent 1** | `Recon` | Identifies technology stacks, entry points, and project structure. |
| **Agent 2** | `Security` | OWASP Top 10 detection, secret synthesis, and injection mitigation. |
| **Agent 3** | `Arch` | Design pattern analysis and architectural boundary mapping. |
| **Agent 4** | `Quality` | Code quality metrics, naming protocols, and consistency checks. |
| **Agent 5** | `Debt` | Technical debt tracking, deprecated dependencies, and TODO indexing. |
| **Agent 6** | `AI` | Analysis of AI-generated code for hallucinations and over-engineering. |
| **Agent 7** | `Synthesis`| Aggregates findings into actionable, contextual reports. |

---

## ✨ Key Features

### 🛡️ Security Intelligence
- **Injection Mitigation**: Real-time detection of SQLi, XSS, and CSRF.
- **Secret Synthesis**: Automated detection of exposed API keys and credentials.
- **Dependency Analytics**: Deep scans of package vulnerabilities.

### 🏛️ Architectural Mapping
- **Logic Duplication**: Identification of redundant code and clones.
- **AST Traversal**: Structural analysis of code intent and flow.
- **Edge Case Logic**: Predictive analysis of unhandled states.

### 📉 Technical Debt & Quality
- **Performance Anti-Patterns**: Detection of inefficient loops and resource leaks.
- **Static Indicators**: Identification of hard-coded values and magic numbers.
- **Memory Hygiene**: Predictive leak detection for high-performance apps.

### 🤖 AI-Specific Analysis
- **Hallucination Filtering**: Validation of AI-generated logic for functional correctness.
- **Style Uniformity**: Ensuring consistent patterns in hybrid AI-human codebases.
- **Redundancy Filter**: Cleaning up overlapping AI-generated abstractions.

---

## 🛠️ Tech Stack

Built with a performance-first approach using the latest cutting-edge technologies.

### Frontend & Core
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Router)
- **UI library**: [React 19.2.3](https://react.dev/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Animations**: [Framer Motion 12.34.0](https://www.framer.com/motion/)
- **Icons**: [Lucide React 0.564.0](https://lucide.dev/)

### Backend & AI
- **Infrastructure**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Workflow Engine**: [Inngest](https://www.inngest.com/) (Durable Background Jobs)
- **AI Models**: Google Gemini 1.5 Pro, GPT-4o, Claude 3.5 Sonnet
- **Git Integration**: `simple-git` for high-performance cloning

---

## 📦 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or pnpm
- Supabase account & Inngest account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hamza-hafeez82/cortex-edr.git
   cd cortex-edr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   INNGEST_EVENT_KEY=your_key
   # ... refer to .env.example
   ```

   **OAuth (GitHub / Google):** In Supabase Dashboard → Authentication → URL Configuration, add these **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

4. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 💳 Pricing Tiers

| Feature | Scout (Free) | Sentinel ($9/mo) | Guardian ($29/mo) | Fortress |
| :--- | :--- | :--- | :--- | :--- |
| **Monthly Scans** | 1 | 10 | Unlimited | Unlimited |
| **Agent Access** | Basic | Advanced | Pro | Custom |
| **Repo Size** | <5k Lines | <50k Lines | <200k Lines | Unlimited |
| **Fix Suggestions** | ❌ | ✅ | ✅ | Custom |
| **PDF Reports** | ❌ | ✅ | ✅ | ✅ |

---

## 🔒 Security & Privacy

Cortex EDR prioritizes the security of your codebase:
- **No Code Storage**: Source code is processed in memory and never stored long-term.
- **Temporary Analysis**: Analysis environments are destroyed immediately after scan completion.
- **Encryption**: All data in transit and at rest is secured using TLS 1.3 and AES-256.

---

<div align="center">

**Built with ❤️ by [Hamza Hafeez](https://linkedin.com/in/hamza-hafeez82)**

[Website](https://www.cortex-edr.com) • [Instagram](https://instagram.com/hamza.hafeez82) • [LinkedIn](https://linkedin.com/in/hamza-hafeez82)

⭐ **Star us on GitHub** to support the project!

</div>
