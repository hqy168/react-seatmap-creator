# Developer Notes

This file contains a small set of practical notes for contributors and maintainers. It explains the current dependency-testing decision, how to run tests locally, and where to look for the key business logic and test mocks.

## Why `--legacy-peer-deps` appears in docs

The repository currently lists React 19 in `package.json`. Some testing libraries (as distributed at the time this project was last updated) declare React 18 as a peer dependency. This mismatch causes `npm install` to fail with an ERESOLVE dependency tree error in strict mode.

To allow local development and CI to continue without forcing an immediate dependency alignment, we use a pragmatic fallback:

- Locally: `npm install --legacy-peer-deps` (falls back to install despite peer dep conflicts)
- CI: The workflow at `.github/workflows/test.yml` tries `npm ci` first and falls back to `npm install --legacy-peer-deps` if `npm ci` fails.

This is a temporary operational decision. Preferably, the project should align testing packages and React to remove the need for the fallback. See "How to remove the fallback" below.

## Quick start (developer)

1. Install dependencies (if `npm install` fails, try the legacy flag):

```bash
npm install --legacy-peer-deps
```

2. Run tests once (non-watch):

```bash
npm test
# which runs: react-scripts test --watchAll=false
```

3. Start the dev server:

```bash
npm start
```

## Tests & mocks

- Global test setup: `src/setupTests.ts` (registers `@testing-library/jest-dom` and centralizes mocks).
- Manual Jest mocks: `src/__mocks__/` (contains `react-hot-toast.js` and `data.json.js` used by tests).
- Unit tests for main business logic: `src/pages/__tests__/useCreatorPage.test.tsx`.

The tests are written as isolated unit tests that mock external modules and avoid network or file-system dependencies.

## Key code locations

- Business logic hub (single source of truth): `src/pages/useCreatorPage.ts`
  - All seat/row mutations (add, edit, delete, reorder, save) live here. Tests call the hook's public API.
- UI: `src/pages/CreatorPage.tsx` and components under `src/components/`.

## How to remove the `--legacy-peer-deps` fallback

Two options:

1. Align the test libraries to React 19 (preferred): upgrade `@testing-library/*` and any other packages to versions that list React 19 as a compatible peer dependency.
2. Downgrade React to a version that matches test tooling peer ranges (e.g., React 18) — this is more invasive and may require code changes.

If you choose option 1, update `package.json` and run `npm install` (without `--legacy-peer-deps`) to verify the tree resolves cleanly. Update the README and CI to remove the fallback once confirmed.

## Notes

- This file is intentionally small and pragmatic. If you'd like, I can:
  - Add an automated workflow job for lint/build alongside tests.
  - Propose a concrete dependency upgrade plan to move off the fallback.

---

Last updated: 2025-10-06
