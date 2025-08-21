# IEC API Bundle

**Folders**
- `docs/openapi.yaml` — OpenAPI 3.1 spec
- `docs/schemas/*.json` — JSON Schemas referenced by the spec
- `postman/iec_postman_collection.json` — Postman v2.1 collection (import in Postman)
- `insomnia/iec_insomnia_export.json` — Insomnia export (import in Insomnia)

**GitHub placement**
- Create a folder at the root of your repo called `api/` and drop these files in.
- Alternatively, move `docs/*` into a top-level `docs/` folder if you prefer GitHub Pages conventions.

**Postman**
1. Open Postman → Import → Choose `postman/iec_postman_collection.json`.
2. Create an environment with `baseUrl` and `token` vars.

**Insomnia**
1. Insomnia → Create → Import from File → select `insomnia/iec_insomnia_export.json`.
2. Edit the Base Environment to set `baseUrl` and `token`.

**Notes**
- Auth is JWT (Supabase). Set `token` to a valid user token.
- No PHI/PII in analytics payloads.
