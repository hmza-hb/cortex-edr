# CortexEDR 🧠🛡️

> **AI-Powered Code Analysis & Security Platform**
> *Instant security, architecture, and code quality insights for your repositories.*

CortexEDR is a next-generation code analysis tool that uses advanced AI (Gemini 1.5 Pro / Grok) to deeply understand your codebase. It goes beyond simple linting to find logic flaws, architectural bottlenecks, and security vulnerabilities that traditional tools miss.

## 🚀 Key Features

- **Security Layer**: Detects exposed secrets, SQL injection, XSS, and OWASP vulnerabilities.
- **Architecture Review**: Identifies coupling issues, design pattern violations, and scalability bottlenecks.
- **Code Quality**: Measures complexity, duplication, and adherence to best practices.
- **Technical Debt**: Tracks TODOs, deprecated dependencies, and "quick hacks".
- **AI-Specific Analysis**: Finds over-engineered AI code, inconsistent styles, and hallucinated patterns.
- **"Fix Prompts"**: Don't just see the problem—get the exact prompt to fix it with your AI coding assistant.

## 💰 Pricing Tiers

| Feature | 🆓 Scout ($0/mo) | 💼 Sentinel ($15/mo) | 🚀 Guardian ($49/mo) | 🏢 Fortress (Custom) |
| :--- | :---: | :---: | :---: | :---: |
| **Repos** | 1 / month | 3 active | 10 active | Unlimited |
| **Repo Size** | < 5k lines | < 50k lines | < 200k lines | Custom |
| **History** | 7 days | 30 days | Forever | Forever |
| **Security** | Basic | Complete | Complete | Custom Rules |
| **Architecture** | ❌ | ✅ | ✅ | ✅ |
| **Fix Prompts** | ❌ | ✅ | ✅ | Custom Models |
| **Support** | Community | Email | Priority | Dedicated |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, install `lucide-react`
- **Backend**: Next.js API Routes, Supabase Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (GitHub, Google, Email)
- **AI Engine**: Gemini 1.5 Pro (Production), Grok (Local/Free)
- **Payments**: Stripe Checkout

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- Supabase Account
- Gemini / Grok API Key
- Stripe Account (for payments)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/cortex-edr.git
    cd cortex-edr
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    GEMINI_API_KEY=your_gemini_key
    STRIPE_SECRET_KEY=your_stripe_key
    ```

4.  **Run Locally:**
    ```bash
    npm run dev
    ```

## 🗺️ Roadmap

- [ ] **Phase 1**: Core Platform & Auth
- [ ] **Phase 2**: Analysis Engine & Report Generation
- [ ] **Phase 3**: Dashboard & Payment Integration
- [ ] **Phase 4**: Advanced Architecture Scans
- [ ] **Phase 5**: Enterprise Features (SSO, CI/CD)

---

Built with ❤️ by [Your Name/Team]
