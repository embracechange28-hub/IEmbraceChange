# I Embrace Change — Master Project Brief

_Last updated: 2025-08 • Audience: product, design, engineering, ops_

## 1) Executive Summary
**Purpose.** Close the women’s health gap with a warm, secure platform that turns lived experience into insight and action.

**Ecosystem (map + mirror).**
- **MenoTracker™** — daily inputs (symptoms, lifestyle, reflections)
- **Inner Compass** — personalized feedback, trends, printable reports
- **Change Atlas** — evidence library, clinical context, research

**Objectives.**
- Guided daily tracking → meaningful self-awareness  
- Evidence-based context → informed decisions  
- Community connection + tiered membership (Free/Core/Premium)  
- Privacy, accessibility, performance baked in

**Core Deliverables.**
- Frontend (React + Tailwind), Backend (Supabase + Stripe), Content/Brand, NFRs (a11y, perf, security)

Links:  
- Full narrative: [`/docs/overview/executive-summary.md`](./docs/overview/executive-summary.md)  
- Ecosystem overview: [`/docs/overview/modules.md`](./docs/overview/modules.md)

---

## 2) Scope & Non-Goals
**In scope (MVP).**
- Auth + 4-step onboarding with consents
- Menotracker “Today/Trends/Library/Professionals”
- Dashboard (post-login)
- Stripe upgrades; CRM basics; transactional email
- Basic analytics (no PHI/PII)

**Non-goals (MVP).**
- Medical diagnosis or clinical messaging
- Raw PHI in analytics/CRM
- Complex journeys (coupons/proration, advanced community tooling)

---

## 3) Plans & Gating Overview
**Plans.** Free / Core / Premium  
**Gates.**
- **Inner Compass** (Premium)  
- **Provider Summary (PDF)** generated in Professionals (Premium path)

Matrix: [`/docs/product/plans-matrix.md`](./docs/product/plans-matrix.md)

---

## 4) Primary User Journeys (high level)
**Signup (4 steps).** 1) Basic account → 2) Additional info (stage + pw confirm) → 3) Privacy & consent → 4) Choose plan  
Details: [`/docs/specs/signup-flow.md`](./docs/specs/signup-flow.md)

**Daily loop.** Dashboard → Start Today’s Tracking → Trends → Library/Professionals → (optional) Report

**Post-auth redirect rule (authoritative).**  
If `?redirect=` allowed → go there; else if `first_login_after_onboarding` → `/menotracker`; else → `/dashboard`.  
Code: [`/apps/web/src/lib/postAuthRedirect.ts`](./apps/web/src/lib/postAuthRedirect.ts)

---

## 5) Page Inventory (at a glance)
| Page | Purpose | Primary CTAs | Acceptance |
| --- | --- | --- | --- |
| Home | Marketing entry | Start Tracking • Learn More | [`/docs/acceptance/home.md`](./docs/acceptance/home.md) |
| About | Brand/mission | Read Alison’s Story | [`/docs/acceptance/about.md`](./docs/acceptance/about.md) |
| Inform & Educate | Searchable library | Read Article | [`/docs/acceptance/inform.md`](./docs/acceptance/inform.md) |
| Support | Help options | Community • Ask an Expert | [`/docs/acceptance/support.md`](./docs/acceptance/support.md) |
| Community | Social proof & routes | Discussions • Ask an Expert | [`/docs/acceptance/community.md`](./docs/acceptance/community.md) |
| **MenoTracker** | Daily inputs & insights | + Add • Add Reflection | [`/docs/acceptance/menotracker.md`](./docs/acceptance/menotracker.md) |
| Legal (Privacy/Terms/etc.) | Compliance | — | [`/docs/acceptance/legal.md`](./docs/acceptance/legal.md) |
| **Dashboard** | Logged-in landing | Start Today’s Tracking | [`/docs/acceptance/dashboard.md`](./docs/acceptance/dashboard.md) |

---

## 6) Architecture & Integrations Snapshot
**Stack.** Web App ↔ **Supabase** (Auth, DB, RLS) ↔ **Stripe** (billing) ↔ **CRM** (lifecycle) ↔ **Email** (transactional)

- Supabase: profiles, consents, menotracker_logs (+ child tables), RLS  
- Stripe: checkout, webhooks as source-of-truth for plan  
- CRM: contacts + tags, opt-in, core events (no PHI)  
- Email: verify/reset/billing/summary templates

Details & checklists: [`/docs/integrations/README.md`](./docs/integrations/README.md)

---

## 7) Success Criteria
**Definition of Done (rolled-up).**
- A11y WCAG 2.2 AA; keyboard-only usable  
- Perf: first meaningful paint < 2s on 3G; Lighthouse ≥90 across categories  
- Security: HTTPS, CSP, least-privileged API, no secrets in client  
- Analytics: page + key events; **no PHI/PII**  
- Canonical copy from i18n; assets labeled

**Top KPIs.**
- Signup → first log conversion  
- D1/D7 return to MenoTracker  
- Time-to-first-value (user reaches “Today” + submits)  
- Upgrade rate Free→Core/Premium

Full AC: [`/docs/acceptance/global-dod.md`](./docs/acceptance/global-dod.md)

---

## 8) Data, Privacy & Analytics Principles
- **PHI/PII:** never in analytics/CRM. Send counts/booleans only.  
- **Consent:** store each consent boolean + timestamp + `policy_version`.  
- **Analytics events:** e.g., `auth_login { success, landing }`, `menotracker_log_submitted { symptom_count, has_reflection }`.  
- **Redirect safety:** whitelist `?redirect=` paths (no external URLs).

Schemas & examples:  
- Events JSON Schemas: [`/schemas/analytics/`](./schemas/analytics/)  
  - `analytics.event.json` (includes `auth_login.properties.landing.enum: ["redirect","menotracker","dashboard"]`)  
- API contract examples: [`/docs/api/examples.md`](./docs/api/examples.md)

---

## 9) Accessibility Commitment
We meet WCAG 2.2 AA with tested focus states, semantic structure, labeled controls, and responsive targets (≥44×44).  
Checklist: [`/docs/accessibility/checklist.md`](./docs/accessibility/checklist.md)

---

## 10) Naming & Copy Governance
**Canonical names.** _MenoTracker™ • Inner Compass • Change Atlas_ (don’t localize product names).  
**Copy source of truth.**  
- MenoTracker canonical keys: [`/i18n/en/menotracker.json`](./i18n/en/menotracker.json)  
- Global strings: [`/i18n/en/app.json`](./i18n/en/app.json)  
**Change process.** PR → copy review → update i18n → snapshot tests → release notes.

---

## 11) Source-of-Truth Index
- OpenAPI / endpoints: [`/api/openapi.yaml`](./api/openapi.yaml)  
- Analytics schemas: [`/schemas/analytics/`](./schemas/analytics/)  
- DB schema (SQL / migrations): [`/schemas/db/`](./schemas/db/)  
- Canonical copy: [`/i18n/en/*.json`](./i18n/en/)  
- Design tokens: [`/design/tokens.json`](./design/tokens.json)  
- Acceptance criteria: [`/docs/acceptance/`](./docs/acceptance/)  
- Error copy (authoritative): [`/docs/errors/edge_cases.csv`](./docs/errors/edge_cases.csv)  
- Redirect util (post-auth): [`/apps/web/src/lib/postAuthRedirect.ts`](./apps/web/src/lib/postAuthRedirect.ts)

---

## 12) Risks, Assumptions, Dependencies
**Top risks.**
1. Webhook reliability (Stripe/Email) → stale plan states  
2. i18n drift vs. UI copy → tests + review gate required  
3. Analytics leakage → PHI scrubbing enforced server-side  
4. Covariates complexity → phased collection + dated fields  
5. A11y/perf regressions → CI checks (Lighthouse/a11y)

**Assumptions.** Supabase Auth as IDP; Canada data residency; CRM is event-light in MVP.  
**Dependencies.** Stripe keys + webhooks; email domain verified; privacy/legal copy provided.

---

## 13) Milestones & Ownership
- **MVP**: Auth + Onboarding + MenoTracker Today/Trends + Dashboard + Billing  
- **Beta**: Professionals report (PDF), Library polish, CRM automations  
- **GA**: Inner Compass full insights, retention nudges, advanced reports

RACI: [`/docs/process/raci.md`](./docs/process/raci.md) • Timeline: [`/docs/process/milestones.md`](./docs/process/milestones.md)

---

## 14) Changelog
| Date | Change | PR |
| --- | --- | --- |
| 2025-08-21 | Initial master brief assembled from specs | #000 |

