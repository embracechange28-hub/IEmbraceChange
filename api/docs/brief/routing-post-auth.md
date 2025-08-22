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

    ┌─ redirect query present? ──┐
    │            yes             │
    │                            ▼
    │                 isAllowed(redirect)?
    │                      │
    │         yes          │          no
    │          ▼           │          ▼
    │     return redirect  │   first_login_after_onboarding?
    │                      │          │
    └──────────┬───────────┘      yes │ no
               ▼                     ▼   ▼
        /menotracker (first run)   /dashboard


---

## 3) Safety & Allow-List

- Accept **paths only** (must start with `/`).
- Reject protocol-relative (`//...`), absolute URLs, and CRLF/whitespace tricks.
- Enforce an allow-list or allow-prefixes for app routes.

**Examples**
- ✅ `/menotracker` • `/menotracker?tab=today` • `/inform/articles/understanding-hot-flashes`
- ❌ `https://evil.com` • `//evil.com` • `javascript:alert(1)` • `/\n/dashboard`

---

## 4) Reference Implementation (TypeScript)

```ts
// /apps/web/src/lib/postAuthRedirect.ts

export type PostAuthArgs = {
  redirect?: string | null | undefined;
  firstLoginAfterOnboarding?: boolean;
};

const ALLOWED_PREFIXES = [
  "/dashboard",
  "/menotracker",
  "/inform",
  "/community",
  "/support",
  "/about",
  "/account",
];

export function isAllowedPath(p?: string | null): boolean {
  if (!p || typeof p !== "string") return false;
  // Must be a same-origin path
  if (!p.startsWith("/")) return false;
  // Disallow protocol-relative and sneaky // at start
  if (p.startsWith("//")) return false;
  // Basic sanitation: strip control chars; reject if any remain
  const cleaned = p.replace(/[\u0000-\u001F\u007F]/g, "");
  if (cleaned !== p) return false;
  // Optional: normalize multiple slashes except query/hash
  // const normalized = cleaned.replace(/\/{2,}(?=[^?]*)(?![^#]*#)/g, "/");

  return ALLOWED_PREFIXES.some(pref => cleaned === pref || cleaned.startsWith(pref + "/") || cleaned.startsWith(pref + "?"));
}

export function postAuthRedirect({ redirect, firstLoginAfterOnboarding }: PostAuthArgs): "/dashboard" | "/menotracker" | string {
  if (redirect && isAllowedPath(redirect)) return redirect;
  if (firstLoginAfterOnboarding) return "/menotracker";
  return "/dashboard";
}
