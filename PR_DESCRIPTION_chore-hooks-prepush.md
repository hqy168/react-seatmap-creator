# PR: chore: stricter Git hooks (husky + lint-staged)

This branch tightens developer tooling to improve code quality and prevent regressions by running format/lint and tests automatically before commits/pushes.

Summary
- Add Husky + lint-staged integration to run Prettier and ESLint autofix on staged files.
- Enforce that no ESLint warnings/errors remain after auto-fix (pre-commit will fail if issues persist).
- Add a pre-push hook that runs the full test suite and blocks pushes on failures.
- Add CI job for lint-and-build and make tests depend on that job.
- Document the hooks and developer workflow in `DEVELOPER_NOTES.md`.

Files changed (high level)
- `.husky/pre-commit` — runs `lint-staged` then `eslint --max-warnings=0` to fail commits with remaining lint issues.
- `.husky/pre-push` — runs `npm test -- --watchAll=false` and blocks pushes on failing tests.
- `.lintstagedrc.json` — config for lint-staged to run Prettier and ESLint autofix on staged files.
- `package.json` — added `prepare` script and devDependencies for husky/lint-staged; added `ajv` dev dep to fix build-time module resolution.
- `.github/workflows/test.yml` — added `lint-and-build` job that runs ESLint and build before tests.
- `DEVELOPER_NOTES.md` — documented how hooks work and how to initialize locally.

Testing performed
- Ran Prettier and ESLint locally; Prettier auto-fixed formatting, ESLint passes with `--max-warnings=0` after fixes.
- Ran unit tests: `npm test -- --watchAll=false` — all tests pass (1 suite, 5 tests).
- Ran a production build (`GENERATE_SOURCEMAP=false npm run build`) — build succeeded locally.

Developer notes for reviewers
- After merging, contributors will need to run `npm install` locally so Husky's `prepare` script runs and installs hooks.
- CI uses a fallback `npm install --legacy-peer-deps` if `npm ci` fails due to peer dependency issues (see `DEVELOPER_NOTES.md`).
- If you prefer not to block commits, consider removing the `--max-warnings=0` enforcement or making the pre-push test a lighter smoke test.

How to create the PR on GitHub
1. Open: https://github.com/hqy168/react-seatmap-creator/pulls
2. Click "Compare & pull request" for branch `chore/hooks-prepush` (or use the Create PR link provided after pushing the branch).
3. Paste this file's content into the PR body if desired.

---

Ready to create the PR if you'd like — I can open a draft PR via the GitHub CLI or prepare a formatted PR body and title for you to paste.
