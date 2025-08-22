# I Embrace Change – Master Project Brief
Prepared for: Bolt.new  
Date: August 2025  

---

## 1. Executive Summary
Purpose: Close the women’s health gap with a digital sanctuary for midlife.  
Core Ecosystem:
- **MenoTracker™** → daily symptom & lifestyle input  
- **Inner Compass** → insights & reports  
- **Change Atlas** → evidence & research library  

Objectives:
- Warm, intuitive, secure platform  
- Structured daily tracking  
- Personalized insights  
- Evidence-based resources  
- Community + tiered membership (Free/Core/Premium)  
- Compliant, accessible  

Deliverables:
- Frontend (React + Tailwind)  
- Backend (Supabase + Stripe)  
- Content & Brand Identity  
- Non-Functional Requirements (accessibility, perf, security)  

Success = User can sign up → onboard → track → see insights → access library → engage community.  

---

## 2. Signup Flow Spec (4 Steps)

1. **Basic Account Creation**  
   Fields: first, last, email, password.  
   CTA: Create Account or Google OAuth.  

2. **Additional Information**  
   Fields: confirm email, password + confirm, menopause stage.  

3. **Privacy & Consent**  
   Required + optional checkboxes.  

4. **Choose Your Plan**  
   Free / Core / Premium options.  
   - Free → /menotracker  
   - Paid → Stripe Checkout → /menotracker  
   Routing: redirect param > first login → /menotracker > else /dashboard  

---

## 3. Major Page Specifications

- **Home**: Hero, 5 pillars, CTAs → /menotracker or /about  
- **About**: Mission, Approach, Team, Alison’s Story  
- **Inform & Educate (Change Atlas)**: search, filters, article cards, newsletter signup  
- **Support**: Community, Ask Expert, live chat/email/phone, fallback contact form  
- **Community**: Metrics, Peer Connection, Ask Expert, testimonials, guidelines  
- **MenoTracker™**: Tabs (Today, Trends, Library, Professionals). Daily log forms + reflections. Premium gating on insights.  
- **Legal Pages**: Privacy, Terms, Disclaimer, Cookies  
- **Dashboard**: Default post-login. Metrics (streak, weekly entries, goal). Quick Actions → tracking, reflections, summary, support  

---

## 4. Acceptance Criteria (Global + Per Page)

**Global Definition of Done**  
- Approved copy, brand, assets  
- Responsive ≥320px  
- WCAG 2.2 AA  
- FMP <2s  
- Analytics instrumented (no PII/PHI)  
- Secure API calls + HTTPS  
- Global header/footer, scroll-to-top  

Each page/module: checklist for content, routing, states, accessibility, analytics.  

---

## 5. API & Data Contract

REST + JSON. Auth = Supabase JWT.  

Example:  
```json
GET /dashboard/summary
{
  "user_id": "uuid",
  "streak_days": 7,
  "entries_this_week": 5,
  "active_goal": { "label": "Wind-down 60m before bed", "status": "on_track" }
}
