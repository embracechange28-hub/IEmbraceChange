# i18n Canonical Copy (MenoTracker)

Files:
- locales/en/menotracker.json — canonical strings
- types/i18n/menotracker.keys.ts — typed key list + guard (ESM)
- types/i18n/menotracker.keys.cjs — key list for Jest (CJS)
- types/i18n/menotracker.keys.d.ts — ambient types for CJS import
- tests/i18n/menotracker.snapshot.test.js — Jest snapshot + coverage tests

## Jest setup
Ensure `jest` can import JSON:
- For Jest 29+, `testEnvironment: 'node'` is fine.
- Add a snapshot serializer if you want stable ordering, or keep as-is.

## Example use in code
import { MenotrackerKey } from '@/types/i18n/menotracker.keys';
function t(k: MenotrackerKey) { /* your i18n lookup */ }
