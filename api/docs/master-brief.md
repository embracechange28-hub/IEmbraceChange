# I Embrace Change – Master Project Brief
Prepared for: Bolt.new  
Date: August 2025  

---

## 1. Executive Summary

**Purpose**  
Close the women’s health gap with a digital sanctuary for midlife, empowering women with symptom tracking, insights, and evidence-based resources.  

**Core Ecosystem**  
- **MenoTracker™** → daily inputs (symptoms, lifestyle, reflections)  
- **Inner Compass** → personalized insights & reports (Premium)  
- **Change Atlas** → evidence library & educational resources  

**Objectives**  
- Warm, intuitive, secure platform  
- Structured daily tracking  
- Personalized insights  
- Evidence-based resources  
- Community + tiered membership  
- Compliant, accessible  

**Deliverables**  
- Frontend: React + Tailwind  
- Backend: Supabase + Stripe  
- Content & Brand Identity  
- Non-functional: Accessibility, performance, security  

**Success Definition**  
User can: sign up → onboard → select plan → log symptoms → see insights → access library → engage community.  

---

## 2. Signup Flow Spec

**Step 1 – Basic Account Creation**  
Fields: first, last, email, password.  
Options: Google OAuth.  
Routing: `/signup → /onboarding/step2`  

**Step 2 – Additional Information**  
Fields: confirm email, password confirm, menopause stage (dropdown).  

**Step 3 – Privacy & Consent**  
Required + optional checkboxes. Stored with timestamps.  

**Step 4 – Choose Your Plan**  
Free → `/menotracker`  
Paid → Stripe Checkout → callback → `/menotracker`  
Redirect rules:  
- `?redirect=` param >  
- first login after onboarding → `/menotracker`  
- else → `/dashboard`  

---

## 3. Major Page Specifications

- **Home**: Hero headline, 5 pillars, CTAs (Start Tracking / Learn More).  
- **About**: Mission, Approach cards, Team, Alison’s Story.  
- **Inform & Educate (Change Atlas)**: Search, filter, article cards, newsletter opt-in.  
- **Support**: Community + Ask Expert cards; Chat/Email/Phone + contact form.  
- **Community**: Metrics, testimonials, guidelines, peer + expert flows.  
- **MenoTracker™**: Tabs = Today / Trends / Library / Professionals. Daily inputs, reflections, provider summary (PDF). Premium gating on Inner Compass.  
- **Legal Pages**: Privacy, Terms, Disclaimer, Cookies.  
- **Dashboard**: Post-login landing. Metrics (streak, weekly, goal), quick actions.  

---

## 4. Acceptance Criteria

**Global Definition of Done**  
- Brand/copy correct  
- Responsive ≥320px  
- WCAG 2.2 AA  
- First meaningful paint <2s  
- Analytics events (no PII/PHI)  
- Secure API calls + HTTPS  
- Global header/footer  

**Per Page/Module**  
- Hero/CTA text matches spec  
- Routing correct  
- Empty/error states present  
- Forms validated + labeled  
- Accessible navigation/tabs  
- Analytics instrumented  

---

## 5. API & Data Contract

All JSON. Auth with Supabase JWT.  

### Auth
```json
POST /auth/signup
{ "first_name":"Alison","last_name":"Copoc","email":"alison@example.com","password":"G00dP@ss!" }
````

```json
POST /auth/login
{ "email":"alison@example.com","password":"G00dP@ss!" }
```

### Profile & Consents

```json
GET /me
{ "id":"uuid","first_name":"Alison","plan":"free","consents":{"is_of_age":true,"accept_terms":true} }
```

```json
PUT /me/consents
{ "is_of_age":true,"accept_terms":true,"policy_version":"2025-08-12" }
```

### MenoTracker Logs

```json
POST /menotracker/logs
{ "date":"2025-08-20","symptoms":[{"name":"Hot Flashes","severity":3}],"reflection":{"mood":"anxious"} }
```

```json
GET /menotracker/logs?from=2025-08-01&to=2025-08-20
{ "items":[{ "date":"2025-08-20","symptoms":[{"name":"Hot Flashes"}] }] }
```

```json
PATCH /menotracker/logs/{entry_id}
{ "reflection":{"mood":"calmer"} }
```

```json
DELETE /menotracker/logs/{entry_id}
204 No Content
```

### Inner Compass Insights

```json
GET /insights/summary?range=last_30d
{ "top_symptoms":[{"name":"Hot Flashes","avg_severity":2.8}],"streaks":{"tracking_days":11} }
```

```json
GET /insights/report?period=2025-07-01..2025-07-31&format=pdf
{ "report_id":"rep_01J2Z9T2C2","url":"https://cdn.iembracechange.com/reports/rep_01J2Z9T2C2.pdf" }
```

### Change Atlas

```json
GET /inform/articles?q=hot
{ "items":[{"slug":"understanding-hot-flashes","title":"Understanding Hot Flashes"}] }
```

```json
GET /inform/topics
{ "topics":[{"slug":"sleep","name":"Sleep","article_count":9}] }
```

### Billing

```json
POST /billing/checkout-session
{ "plan":"core","success_url":".../callback?status=success" }
```

```json
GET /checkout/callback?status=success&session_id=cs_test
{ "updated":true,"plan":"core" }
```

```json
POST /webhooks/stripe
{ "type":"checkout.session.completed","data":{"object":{"id":"cs_test"}} }
```

### Support Contact

```json
POST /support/contact
{ "name":"Alison","email":"alison@example.com","subject":"Issue","message":"Entries not saving" }
```

### Analytics Event

```json
POST /analytics/event
{ "event":"menotracker_log_submitted","timestamp":"2025-08-20T16:02:00Z","properties":{"symptom_count":2} }
```

---

## 6. Integrations

* **Supabase**: Auth, Profiles, Logs, RLS
* **Stripe**: Plans + Checkout + webhooks
* **CRM**: Contact creation + tags + lifecycle events
* **Email**: Transactional (welcome, verify, reset, billing)
* **Analytics**: Basic page + event logging

MVP vs Phase 2: Phase 2 adds audit logs, annual billing, journeys, event bus.

---

## 7. UX & Design System – Components

* **Global**: Header, Footer
* **Content**: Hero Banner, Section Header, CTA Block
* **Data**: Feature Grid, Testimonial Card, Info Card
* **Interaction**: Form, Button, Modal
* **Tracker-Specific**: Symptom Entry, Lifestyle Block, Reflection Block, Dashboard Card
* **Navigation**: Tabs, Sidebar, Breadcrumb

---

## 8. Accessibility Checklist

* Contrast 4.5:1 (text), 3:1 (UI)
* Semantic headings, resizable text
* Keyboard navigable, visible focus
* Labels for all form fields
* Alt text + transcripts for media
* Touch targets ≥44px
* Plain language

---

## 9. Design Tokens

```json
{
  "colors": {
    "primary": "#CFA9A0",
    "secondary": "#A8BFAA",
    "tertiary": "#B9A7C8",
    "neutralLight": "#F8F8F8",
    "neutralDark": "#333333",
    "highlight": "#9BC4E2",
    "success": "#A8D5BA",
    "warning": "#F9E79F",
    "error": "#E57373"
  },
  "typography": {
    "fontHeading": "Playfair Display, serif",
    "fontBody": "Lato, sans-serif",
    "fontMono": "Source Code Pro, monospace"
  },
  "spacing": { "xs": "4px","sm": "8px","md": "16px","lg": "24px","xl": "40px" },
  "radius": { "sm": "4px","md": "8px","lg": "16px","pill": "50px" },
  "shadows": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 4px 6px rgba(0,0,0,0.1)",
    "lg": "0 10px 20px rgba(0,0,0,0.15)"
  }
}
```

---

## 10. MenoTracker Module Briefing

* **Start Page (Today)**: Cards for Physical, Emotional, Lifestyle + “Add” & “Add Reflection”.
* **Trends**: Charts of patterns; empty state until enough data.
* **Library**: Resource cards → Change Atlas.
* **Professionals**: Generate Provider Summary PDF; Latest Research; Treatment Options.

---

## 11. Inner Compass (Premium)

* Lock screen for non-premium users.
* Tabs: Research Insights | Treatment Options | Personalized Report.
* Provider reports printable/exportable.
* Data sources: MenoTracker + external research.

```
