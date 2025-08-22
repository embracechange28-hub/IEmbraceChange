# Post-Auth Routing (Redirects & Landings)

**Goal:** deterministically route users after a successful authentication or checkout, without open-redirect risk or UX dead ends.

Authoritative rule (from the brief):
> If `?redirect=` is present **and allowed**, go there.  
> Else if `first_login_after_onboarding` → `/menotracker` (first-run check-in).  
> Else → `/dashboard`.

---

## 1) TL;DR

- Never trust a raw `redirect` query string. Only allow **same-origin, whitelisted paths**.
- Clear, single function decides landing: `postAuthRedirect({ redirect, firstLoginAfterOnboarding })`.
- Log an analytics event `auth_login` with `landing: "redirect" | "menotracker" | "dashboard"` (no PHI).

---

## 2) Decision Tree

