# I Embrace Change – System Architecture & Flows

This document collects core ecosystem, flow, and design system diagrams using **Mermaid** syntax.  

***

## 1. Ecosystem – “Map & Mirror” Model
MenoTracker (input) → Inner Compass (personalized insights) → Change Atlas (evidence library).

```mermaid
flowchart LR
  subgraph User["User"]
  end

  MT["MenoTracker™\nDaily input & tracking"]
  IC["Inner Compass\nPersonalized insights & reports"]
  CA["Change Atlas\nEvidence-based guidance & context"]

  User --> MT
  MT -- "entries (symptoms, lifestyle, reflections)" --> IC
  MT -- "user experience → topics" --> CA
  IC -- "links to education & options" --> CA
  CA -- "informs interpretations" --> IC

  classDef input fill:#F9E79F,stroke:#333,stroke-width:1px,color:#000;
  classDef insights fill:#A8D5BA,stroke:#333,stroke-width:1px,color:#000;
  classDef library fill:#B9A7C8,stroke:#333,stroke-width:1px,color:#000;

  class MT input;
  class IC insights;
  class CA library;
```

***

## 2. Signup & Onboarding Flow
Covers Step 1–4 with guards for authentication and consent.

```mermaid
flowchart TD
  A["/signup (Step 1)\nCreate Account"] --> B["/onboarding/step2\nPassword + Menopause Stage"]
  B --> C["/onboarding/step3\nPrivacy & Consents (required + optional)"]
  C --> D["/onboarding/step4\nChoose Plan (Free/Core/Premium)"]

  D -->|Free| E["Activate plan=free"]
  D -->|Core/Premium| F["Stripe Checkout"]
  F --> G["/checkout/callback\nVerify via webhook → plan active"]

  E --> H["/menotracker"]
  G --> H["/menotracker"]

“After subsequent logins (no ?redirect=), default landing is /dashboard.”

%% Replace the tail of your onboarding flow (after callback)
E["Activate plan=free"] --> H["/menotracker (first run)"]
G["/checkout/callback → plan active"] --> H
%% Subsequent logins:
SignInSuccess["/signin success"] --> D1{"has redirect?"}
D1 -- no --> D2["/dashboard (default)"]
D1 -- yes --> D3["redirect target"]


  %% Guards / Redirects
  X["Unauthenticated user"] -->|visits /menotracker| R["Redirect → /signin?redirect=/menotracker"]
  Y["Missing stage/consents"] -->|visits app areas| O["Redirect → /onboarding"]

  classDef step fill:#D7F0F7,stroke:#333,color:#000;
  classDef action fill:#A8D5BA,stroke:#333,color:#000;
  classDef guard fill:#F6B7C1,stroke:#333,color:#000;

  class A,B,C,D,E,F,G,H step;
  class X,Y,R,O guard,step;
```

***

## 3. Page Routing & Guards
Global app routes with authentication + consent checks.

```mermaid
stateDiagram-v2
  [*] --> Home
  Home --> About
  Home --> Inform
  Home --> Community
  Home --> MenoTracker
  Home --> InnerCompass
  Home --> Dashboard

  state if_auth <<choice>>
  state if_consents <<choice>>
  state if_premium <<choice>>
  state if_redirect <<choice>>

  %% --- Auth + Redirect guard (applies to protected routes) ---
  MenoTracker --> if_auth
  InnerCompass --> if_auth
  Dashboard --> if_auth
  if_auth --> SignIn: not authenticated
  if_auth --> if_consents: authenticated

  %% --- Consent guard for MenoTracker ---
  if_consents --> Onboarding: missing stage/required consents
  if_consents --> MenoToday: OK

  %% --- Premium gating for Inner Compass ---
  InnerCompass --> if_premium
  if_premium --> LockScreen: plan != premium
  if_premium --> ICFull: plan == premium

  %% --- Post-login default route ---
  SignIn --> if_redirect: login success
  if_redirect --> Dashboard: no redirect param
  if_redirect --> RequestedRoute: has ?redirect=

  %% --- MenoTracker internal tabs ---
  state MenoToday {
    [*] --> Today
    Today --> Trends
    Today --> Library
    Today --> Professionals
  }

```

***

## 4. Support Page Logic
Membership gating + office hours logic for chat & phone support.

```mermaid
flowchart LR
  S["/support"] --> C1["Join Our Community → /community"]
  S --> C2["Ask an Expert → /community/ask-an-expert"]
  S --> L["Live Chat"]
  S --> E["Email Support"]
  S --> P["Phone Support (Premium)"]

  L -->|In hours| Live["Open chat widget"]
  L -->|Off hours| Msg["Capture message form"]

  P -->|User is Premium & hours ok| Call["Show number/initiate call"]
  P -->|Not Premium or off hours| Guard["Show upsell or callback form"]

  classDef node fill:#D7F0F7,stroke:#333,color:#000;
  classDef action fill:#A8D5BA,stroke:#333,color:#000;
  classDef guard fill:#F6B7C1,stroke:#333,color:#000;

  class S,C1,C2,L,E,P,Live,Msg,Call,Guard node;
```

***

## 5. Component Map – UX Design System
Reusable components defined once, referenced across pages.

```mermaid
graph TD
  classDef global fill:#CFA9A0,stroke:#333,color:#000
  classDef content fill:#D8DED3,stroke:#333,color:#000

  %% Pages
  H[Header] --> Home[Homepage]
  H --> About[About Page]
  H --> Inform[Inform Hub]
  H --> Community[Community]
  H --> Tracker[MenoTracker]
  H --> Dashboard[Dashboard]
  H --> IC[Inner Compass]

  F[Footer] --> Home
  F --> About
  F --> Inform
  F --> Community
  F --> Tracker
  F --> Dashboard
  F --> IC

  %% Shared components
  subgraph Shared ["Shared Components"]
    HB[Hero Banner]
    CTA[Call to Action Block]
    FG[Feature Grid]
    TC[Testimonial Card]
    Form[Form with Validations]
    MC[Metric Card]
    QA[Quick Action Card]
    LS[Lock Screen Premium]
    SP[Summary Preview]
  end

  %% Usage
  Home --> HB
  Home --> CTA
  Home --> FG
  Home --> TC
  Home --> Form

  About --> HB
  Inform --> FG
  Inform --> CTA
  Community --> FG
  Tracker --> Form

  %% New: Dashboard + Inner Compass mappings
  Dashboard --> MC
  Dashboard --> QA
  IC --> LS
  IC --> SP

  class H,F global
  class HB,CTA,FG,TC,Form,MC,QA,LS,SP content
```

***

## 6. Webhooks & Data Flows

6.1 Stripe → Webhook → Supabase Plan Sync

```mermaid

flowchart LR
  U[User] -->|Upgrade/Checkout| App[App]
  App -. opens .-> CO[Stripe Checkout]
  CO -- events --> WH[Webhook Handler /webhooks/stripe]
  WH -->|verify sig + map price → plan| DB[(Supabase profiles.plan)]
  DB --> App
  App --> CRM[CRM/Email]:::sidecar
  classDef sidecar fill:#EFEFEF,stroke:#999,color:#111

```

***

6.2 Data & Insights Pipeline (Map-and-Mirror)

```mermaid

flowchart LR
  MT[(MenoTracker Logs)] --> IC[Inner Compass Engine]
  CV[(Profile Covariates)] --> IC
  IC --> TR[Trends & Correlations]
  IC --> PS[[Provider Summary (PDF/Print)]]
  TR --> CA[Change Atlas Links]
  PS --> U[User / Clinician]

```


***

## 7. Legend (Component Map)

```mermaid
flowchart LR
  A[Global Header Footer]
  B[Used on all pages]
  C[Content blocks Hero CTA Feature Testimonial Form]
  D[Reusable via props]
  A --> B
  C --> D
```
