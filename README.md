<div align="center">

<img src="https://img.shields.io/badge/CortexEDR-AI%20Security%20Orchestration-purple?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnoiIGZpbGw9IiNhODU1ZjciLz48L3N2Zz4=" alt="CortexEDR Logo" />

# 🧠 CortexEDR - Complete Introduction

### **AI-Powered Security Auditing Platform**

*Enterprise-grade security analysis at indie prices. Your AI coded it, we audit it.*

[![Website](https://img.shields.io/badge/Website-cortex--edr.com-purple?style=flat-square)](https://www.cortex-edr.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

[ Live Demo ](https://www.cortex-edr.com) • [ Documentation ](#documentation) • [ Report Issue ](https://github.com/hamza-hafeez82/cortex-edr/issues)

</div>

---

## 📖 THE BACKGROUND STORY

### The Problem
In early 2025, the world witnessed a seismic shift in software development. AI coding tools like GitHub Copilot, Cursor, ChatGPT, and Claude became mainstream. Developers were shipping code 10x faster than ever before.

But there was a dark side: AI-generated code was riddled with security vulnerabilities.

Studies showed that 40% of AI-generated code contained at least one critical security flaw. SQL injection, XSS, hardcoded secrets, insecure authentication - the issues were everywhere.

Meanwhile, enterprise security tools cost $500-2,000/month. Tools like Snyk, Checkmarx, and Veracode were built for Fortune 500 companies with dedicated security teams. Indie developers, students, and small startups couldn't afford them.

Then, on February 18, 2025, Anthropic launched Claude Code Security - an AI-powered security analysis tool. Within 24 hours, $15 billion was wiped off cybersecurity stocks. The market validated what many already knew: AI-powered security is the future.

But Anthropic's solution was enterprise-focused, with no pricing for individuals or small teams.

### The Founder
Hamza Hafeez Bhatti - a 19-year-old computer science student from Lahore, Pakistan - saw the gap.

In November 2025, Hamza published research titled "Project Cortex: A Prefrontal-Cortex-Inspired Orchestrated Architecture for Artificial General Intelligence." The paper proposed a new way to build AI systems - not through massive single models, but through coordinated multi-agent orchestration inspired by how the human prefrontal cortex works.

The human prefrontal cortex doesn't do everything itself. Instead, it orchestrates specialized brain regions:

- Visual cortex handles sight
- Memory systems store information
- Motor cortex controls movement
- The prefrontal cortex coordinates everything

Hamza believed AI should work the same way: specialized agents coordinated by an intelligent orchestrator.

In January 2026, he started building CortexEDR - applying his AGI research to solve the AI code security problem.

By March 2026, CortexEDR was ready to launch.

---

## 🎯 WHAT IS CORTEXEDR?

CortexEDR (Cortex Endpoint Detection & Response) is an AI-powered security auditing platform that analyzes your entire codebase in 2-5 minutes and finds security vulnerabilities, architecture issues, code quality problems, and technical debt.

### The Core Value Proposition:

**"Enterprise-grade security analysis at indie prices. Your AI coded it, we audit it."**

### Who It's For:

- Indie developers building with AI tools
- Students learning to code
- Freelancers shipping client projects
- Startups building MVPs
- Small teams without security expertise

### What Makes It Different:

- Brain-inspired architecture (based on published AGI research)
- 7 specialized AI agents working together
- Conversational AI advisor (Cortex Chat)
- Real-time visualization (watch agents work)
- $9/month pricing (vs $500+ enterprise tools)

---

## 🏗️ THE ARCHITECTURE (How It Actually Works)

CortexEDR uses a 7-agent orchestration system inspired by the human prefrontal cortex. Each agent is a specialized AI model focused on one cognitive function.

### The 7 Specialized Agents:

### 1. Git Connect Agent

**Role:** Repository acquisition and validation
**What it does:** Clones your GitHub repository, validates access, maps the file structure
**AI Model:** Lightweight orchestration (no AI needed - pure code)
**Output:** Complete repository snapshot, file tree, metadata

### 2. Reconnaissance Agent

**Role:** Codebase mapping and context analysis
**What it does:**
- Identifies tech stack (React, Next.js, Python, etc.)
- Detects frameworks and libraries
- Maps dependencies (package.json, requirements.txt)
- Analyzes project structure
- Estimates complexity

**AI Model:** Gemini Flash / Claude Haiku
**Output:** Complete tech stack profile, dependency graph, complexity score

### 3. Security Scanner Agent ⭐ (Most Critical)

**Role:** Deep vulnerability detection
**What it does:**
- Scans every file for security issues
- Detects SQL injection, XSS, CSRF, SSRF
- Finds hardcoded secrets (API keys, passwords)
- Identifies insecure authentication
- Checks for weak encryption
- Maps to CWE/OWASP standards

**AI Model:** DeepSeek R1 (reasoning-focused) / Claude Sonnet
**Output:** Complete vulnerability report with:
- Severity (Critical/High/Medium/Low)
- Exact file location and line number
- Vulnerable code snippet
- Detailed explanation
- Fix suggestion
- AI-generated fix prompt

### 4. Architecture Analyzer Agent

**Role:** Design pattern analysis
**What it does:**
- Reviews architectural decisions
- Identifies anti-patterns
- Checks separation of concerns
- Analyzes scalability issues
- Reviews API design

**AI Model:** Claude Sonnet / Gemini Pro
**Output:** Architecture assessment, design recommendations

### 5. Code Quality Agent

**Role:** Best practices enforcement
**What it does:**
- Checks coding standards
- Identifies code smells
- Reviews maintainability
- Detects duplicate code
- Analyzes complexity metrics

**AI Model:** Gemini Flash
**Output:** Code quality score, improvement suggestions

### 6. Technical Debt Agent

**Role:** Maintenance issue detection
**What it does:**
- Finds TODO comments
- Identifies deprecated code
- Detects hardcoded values
- Flags commented-out code
- Reviews dependency versions

**AI Model:** Gemini Flash
**Output:** Technical debt inventory, prioritization

### 7. AI-Specific Agent (Unique to CortexEDR)

**Role:** AI-generated code pattern analysis
**What it does:**
- Detects AI-generated code signatures
- Identifies common LLM mistakes
- Flags AI-generated security issues
- Reviews AI coding patterns

**AI Model:** Claude Sonnet
**Output:** AI code quality assessment

### The Orchestrator (The Brain)

The Orchestrator coordinates all 7 agents like the prefrontal cortex coordinates brain regions.

**How it works:**

#### Goal Decomposition
- User submits GitHub URL
- Orchestrator breaks task into subtasks
- Assigns each subtask to appropriate agent

#### Sequential Execution
- Agents execute in order (Git → Reconnaissance → Security → etc.)
- Each agent's output becomes context for next agent
- Orchestrator monitors progress in real-time

#### Conflict Resolution
- When agents disagree (e.g., "Is this a vulnerability?"), Orchestrator arbitrates
- Uses hierarchical reasoning to synthesize final verdict

#### Synthesis
- Orchestrator combines all agent outputs
- Generates unified security report
- Calculates overall security score (0-100)

#### Memory Management
- Shared memory system (like working memory in brain)
- All agents read/write to shared context
- Ensures consistency across analysis

---

## ⚙️ HOW IT WORKS (User Journey)

### Step 1: Repository Submission
**User:** Pastes GitHub URL into CortexEDR
**System:** Validates URL, checks access permissions

### Step 2: Live Scanning (2-5 minutes)
Real-time visualization shows:
- Which agent is currently active
- Files being processed
- Progress percentage
- Issues found so far

**Visual flow:**
```
[Git Connect] ✓ Cloning repository...
  ↓ 31 files detected

[Reconnaissance] ⚙️ Analyzing structure...
  ↓ Next.js 14, TypeScript, Supabase detected

[Security Scanner] 🔍 Deep security audit...
  ↓ Found 3 SQL injection vulnerabilities
  ↓ Found 2 hardcoded API keys
  ↓ Found 5 XSS vulnerabilities

[Architecture] 🏗️ Reviewing design patterns...
  ↓ Monolithic architecture detected
  ↓ Missing error handling

[Code Quality] ✨ Checking best practices...
  ↓ 127 lines of duplicate code

[Technical Debt] ⚠️ Identifying maintenance issues...
  ↓ 14 TODO comments
  ↓ 3 deprecated dependencies

[AI Analysis] 🤖 Detecting AI patterns...
  ↓ 67% AI-generated code detected
  ↓ 4 common LLM security mistakes

[Synthesis] 🧠 Generating report...
  ✓ Scan complete!
```

### Step 3: Comprehensive Report

The **Audit Manifest** includes:

#### A. Overall Security Score
```
Score: 64/100
Status: NEEDS IMPROVEMENT
```

#### B. Risk Distribution
- 🔴 Critical: 2 issues
- 🟠 High: 7 issues
- 🟡 Medium: 12 issues
- 🟢 Low: 10 issues

#### C. Executive Synthesis
AI-generated summary:
```
"The codebase has several critical security issues
that need immediate attention, including SQL injection
vulnerabilities in the authentication system and
hardcoded API keys in configuration files..."
```

#### D. Detailed Issue List
Each issue includes:

**Issue #1: SQL Injection in Authentication**
- **Severity:** CRITICAL
- **Category:** Security
- **CWE:** CWE-89 (SQL Injection)
- **OWASP:** A03:2021-Injection
- **File:** app/api/auth/route.ts
- **Line:** 47
- **Vulnerable Code:**
  ```typescript
  const query = `SELECT * FROM users WHERE email = '${userEmail}'`
  ```
- **Description:** The application constructs a SQL query using string concatenation with unsanitized user input. An attacker could inject malicious SQL code to bypass authentication or extract sensitive data.
- **How to Fix:** Use parameterized queries with prepared statements.
- **Fixed Code:**
  ```typescript
  const query = 'SELECT * FROM users WHERE email = ?'
  const result = await db.query(query, [userEmail])
  ```
- **AI Fix Prompt (Copy to Cursor):**
  ```
  "Fix the SQL injection vulnerability in app/api/auth/route.ts
  line 47 by using parameterized queries instead of string
  concatenation. Ensure all user inputs are sanitized."
  ```

#### E. Repository Insights
- **Tech Stack:** Next.js 14, TypeScript, Supabase
- **Total Files:** 31
- **Lines of Code:** 4,287
- **Complexity:** Medium
- **AI-Generated:** 67%
- **Frameworks:** React, Tailwind CSS
- **Dependencies:** 47 packages (3 outdated)

### Step 4: Cortex Chat (AI Advisor)

After scanning, users can chat with Cortex - an AI advisor with complete knowledge of their codebase.

**Example conversation:**
```
User: "Why is line 47 flagged?"
Cortex:
"Line 47 in your auth route is vulnerable to SQL injection
because you're building the query with template literals
using ${userEmail} directly.

Here's what an attacker could do:
If they input: ' OR '1'='1
Your query becomes: SELECT * FROM users WHERE email = '' OR '1'='1'
This returns all users, bypassing authentication.

Fix it by switching to parameterized queries. Want me to
show you the exact code?"

User: "Yes, show me"
Cortex:
"Replace line 47 with:
typescript
const query = 'SELECT * FROM users WHERE email = ?'
const result = await db.query(query, [userEmail])

This ensures userEmail is properly escaped. The database
treats it as data, not executable code.

You have this same pattern in 3 other files. Want me to
find them all?"
```

---

## 🎨 WHAT IT PRODUCES (Deliverables)

### 1. Security Audit Manifest (Web View)
- Interactive report in browser
- Overall score with visual gauge
- Risk distribution charts
- Issue cards with expand/collapse
- Filterable by severity/category
- Shareable link

### 2. PDF Export
- Professional security report
- Company branding (for paid plans)
- Executive summary
- Detailed findings
- Remediation roadmap
- Compliance mapping (SOC2, ISO 27001)

### 3. Cortex Chat Transcript
- Complete conversation history
- AI explanations and recommendations
- Code examples and fixes
- Strategic advice

### 4. GitHub Issue Integration (Coming Soon)
- Auto-create GitHub issues for each vulnerability
- Assign to team members
- Track fix progress
- Link to scan results

### 5. Fix Prompts
- AI-generated prompts for Cursor/Claude
- Copy-paste directly into your AI coding tool
- Specific to your codebase
- Include file paths and context

---

## 💡 UNIQUE FEATURES

### 1. Real-Time Agent Visualization
Watch AI agents work in real-time:
- See which agent is active
- Track file-by-file progress
- Live issue counter
- Animated agent transitions
- No other tool shows you this

### 2. Cortex Chat (Codebase-Aware AI)
Talk to an AI that actually knows your code:
- Ask questions in plain English
- Get answers with file/line references
- Discuss architecture decisions
- Get strategic business advice
- ChatGPT can't do this

### 3. AI-Generated Code Detection
First tool to specifically analyze AI-coded projects:
- Detects Copilot/Cursor/ChatGPT patterns
- Identifies common LLM security mistakes
- Flags AI-generated technical debt
- Built for the AI coding era

### 4. Brain-Inspired Architecture
Based on published AGI research:
- Multi-agent orchestration
- Hierarchical reasoning
- Shared memory system
- Conflict resolution
- More sophisticated than single-model tools

### 5. Affordable Pricing
- **Free:** $0 (5 scans/month)
- **Starter:** $9/month (25 scans)
- **Team:** $49/month (100 scans)
- **Enterprise tools:** $500-2000/month

---

## 📊 TECHNICAL STACK

### Frontend:
- **Next.js 14** (App Router, RSC)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **React Server Components**

### Backend:
- **Next.js API Routes**
- **Supabase** (PostgreSQL)
- **Clerk Authentication**
- **Railway Hosting**

### AI Infrastructure:
- **Gemini 2.0 Flash** (free tier, reconnaissance)
- **DeepSeek R1** (reasoning, security analysis)
- **Claude 3.5 Sonnet** (premium, synthesis)
- **Groq Llama** (fallback)
- **Custom orchestration engine**

### Database Schema:
```sql
- users (Clerk auth)
- profiles (plan, subscription)
- scans (repo_url, score, status)
- issues (vulnerability details)
- scanned_files (code content)
- chat_messages (Cortex conversations)
```

---

## 🎯 THE COMPETITIVE EDGE

| Feature | CortexEDR | Snyk | Checkmarx | GitHub Advanced Security |
|---------|-----------|------|-----------|------------------------|
| **Price** | $9/month | $500+/month | $2000+/month | $49/user/month |
| **Setup Time** | 2 minutes | Days/Weeks | Weeks | Hours |
| **AI Chat** | ✅ | ❌ | ❌ | ❌ |
| **Live Viz** | ✅ | ❌ | ❌ | ❌ |
| **AI Code Detection** | ✅ | ❌ | ❌ | ❌ |
| **Brain Architecture** | ✅ (7 agents) | ❌ (single scan) | ❌ | ❌ |
| **Free Tier** | ✅ (5 scans) | ❌ | ❌ | ❌ |
| **Target User** | Indie devs | Enterprise | Enterprise | Teams |

---

## 🚀 THE VISION

### Short-term (2026):
- Become the #1 security tool for indie developers
- 10,000 users
- $50K MRR
- GitHub Actions integration
- IDE plugins (VS Code, Cursor)

### Mid-term (2027):
- Team collaboration features
- Compliance reporting (SOC2, ISO 27001)
- Container scanning
- Infrastructure as Code analysis
- $500K ARR

### Long-term (2028+):
- Apply Project Cortex architecture to other domains
- Automated penetration testing
- Real-time code scanning (as you type)
- White-label solution for enterprises
- $10M ARR

---

## 💬 THE TAGLINE

**"Enterprise security. Indie prices. Brain-powered AI."**

or

**"Your AI coded it. We audit it."**

or

**"7 AI agents. 2 minutes. Complete security audit."**

---

## 🎓 THE RESEARCH FOUNDATION

CortexEDR is the first commercial application of **Project Cortex** - Hamza's published research on prefrontal-cortex-inspired AGI.

**Key concepts from the research:**
- **Executive Control:** Orchestrator coordinates agents like prefrontal cortex coordinates brain
- **Specialized Modules:** Each agent handles one cognitive function
- **Shared Memory:** All agents access unified knowledge base
- **Hierarchical Planning:** Complex tasks decomposed into subtasks
- **Conflict Resolution:** Orchestrator arbitrates when agents disagree

This isn't just marketing - it's real AI research applied to solve real problems.

---

## ✅ SUMMARY

CortexEDR is:

- AI-powered security auditing platform
- 7 specialized agents coordinated by brain-inspired orchestrator
- Analyzes entire codebases in 2-5 minutes
- Finds vulnerabilities, architecture issues, code quality problems
- Includes Cortex Chat - AI advisor with deep codebase knowledge
- Real-time visualization of agent activity
- $9/month (vs $500+ enterprise tools)
- Built by 19-year-old AI researcher from Pakistan
- Based on published AGI research (Project Cortex)
- Designed for indie developers using AI coding tools

**The mission:** Democratize security. Make enterprise-grade code analysis accessible to every developer, not just Fortune 500 companies.

**The market opportunity:** With AI tools generating billions of lines of code monthly, and AI-generated code having 40% vulnerability rates, the need for automated security analysis has never been greater.

**The differentiator:** While competitors build single-model scanners, CortexEDR uses brain-inspired multi-agent orchestration to deliver deeper, more intelligent analysis at 98% lower cost.

This is CortexEDR. This is the future of code security. 🧠🚀

---

# CortexEDR - Complete Feature Breakdown

Based on everything we've built and discussed, here's what CortexEDR actually has:

## ✅ CURRENT FEATURES (What's Built & Working)

### 1. AI-Powered Security Scanning

**7-Agent Orchestration System:**
- **Git Connect Agent** - Clones and analyzes repository structure
- **Reconnaissance Agent** - Maps entire codebase, dependencies, tech stack
- **Security Scanner Agent** - Deep vulnerability analysis (SQL injection, XSS, SSRF, hardcoded secrets, etc.)
- **Architecture Analyzer Agent** - Reviews design patterns, identifies architectural issues
- **Code Quality Agent** - Checks best practices, code smells, maintainability
- **Technical Debt Agent** - Finds TODOs, deprecated code, hardcoded values, duplications
- **AI-Specific Agent** - Detects AI-generated code patterns and issues
- **Orchestrator** - Synthesizes all findings into actionable insights

**What it scans:**
- GitHub repositories (public & private)
- Multiple languages (JavaScript, TypeScript, Python, Go, Java, Ruby, PHP, etc.)
- Full codebase analysis (not just surface-level)

**What it finds:**
- Security vulnerabilities (CWE/OWASP classified)
- Architecture problems
- Code quality issues
- Technical debt
- AI-generated code patterns

### 2. Real-Time Scan Visualization

**Live Agent Activity:**
- Watch each agent work in real-time
- See file-by-file progress
- Agent status indicators
- Estimated time remaining
- Beautiful animations

**Progress Tracking:**
- File count processed
- Current agent active
- Completion percentage
- Issues found so far

### 3. Comprehensive Security Reports

**Audit Manifest:**
- Overall security score (0-100)
- Risk distribution (Critical/High/Medium/Low)
- Executive synthesis (AI-generated summary)
- System verification badge
- Shareable PDF export

**Issue Details:**
- Severity classification
- CWE/OWASP mappings
- Exact file location (file + line number)
- Vulnerable code snippet
- Detailed explanation
- Fix suggestions
- AI-generated fix prompt (copy-paste to Cursor/Claude)

**Risk Distribution:**
- Visual breakdown by severity
- Category-wise analysis
- Priority recommendations

### 4. Cortex Chat (AI Security Advisor)

**Codebase-Aware Conversations:**
- Knows your entire codebase after scanning
- Understands all vulnerabilities found
- Can explain any issue in detail
- References specific files and line numbers
- Provides architectural advice
- Answers technical questions

**What Cortex Can Do:**
- Explain vulnerabilities in context
- Help prioritize fixes
- Suggest refactoring strategies
- Compare scans over time
- Answer "why is this vulnerable?"
- Generate fix strategies
- Provide business impact analysis

**Multi-Modal Context:**
- Load specific scans into conversation
- Switch between different projects
- Upload code snippets for review
- Ask general security questions

### 5. Scan History & Management

**Dashboard:**
- All scans listed chronologically
- Quick stats (score, issues, date)
- Status indicators (completed/in-progress/failed)
- One-click to view reports
- Repository management

**Saved Repositories:**
- Quick re-scan functionality
- Track progress over time
- Compare historical scans
- See security score trends

### 6. Authentication & User Management

**Powered by Clerk:**
- Email/password authentication
- Google OAuth
- GitHub OAuth
- Secure session management
- User profiles
- Multi-device support

### 7. GitHub Integration

**Repository Connection:**
- Paste GitHub URL to scan
- Auto-clone and analyze
- Support for private repos (coming soon)
- Handles any repository size
- Automatic dependency detection

### 8. Professional UI/UX

**Design System:**
- Dark theme optimized for developers
- Responsive (mobile, tablet, desktop)
- Professional color palette
- Smooth animations
- Loading states
- Error handling

**Navigation:**
- Intuitive sidebar
- Quick access to key features
- Breadcrumb navigation
- Search functionality (coming soon)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm, yarn, or pnpm
- Supabase account
- Clerk account

### Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/hamza-hafeez82/cortex-edr.git
   cd cortex-edr
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your keys
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Start Scanning**
   - Visit `http://localhost:3000`
   - Paste your GitHub repository URL
   - Watch the AI agents work in real-time

---

## 💰 Pricing Plans

| Plan | Price | Monthly Scans | Features |
|------|-------|---------------|----------|
| **Free** | $0 | 5 scans | Basic scanning, reports, chat |
| **Starter** | $9/month | 25 scans | Everything in Free + PDF export |
| **Team** | $49/month | 100 scans | Everything in Starter + team features |
| **Enterprise** | Custom | Unlimited | Custom integrations, SLA, support |

---

<div align="center">

**Built with ❤️ by [Hamza Hafeez Bhatti](https://linkedin.com/in/hamza-hafeez82)**

*19-year-old AI researcher from Lahore, Pakistan • Published AGI research → Commercial product*

[Website](https://www.cortex-edr.com) • [LinkedIn](https://linkedin.com/in/hamza-hafeez82) • [GitHub](https://github.com/hamza-hafeez82)

⭐ **Star us on GitHub** to support the democratization of security!

</div>
