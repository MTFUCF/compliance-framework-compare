# Manual Testing Guide

Project: **Compliance Framework Compare**  
Baseline date: **2026-05-16**

## P0 — must pass before this repo is public
- [ ] The README title, tagline, live demo URL, and author block all match Compliance Framework Compare.
- [ ] `index.html` loads from `python -m http.server 8080` with no broken relative links.
- [ ] The shipped page clearly states the project name, renders the theme toggle, and credits Matthew Faber in the footer.
- [ ] No secrets, local-only files, or editor junk appear outside the `.gitignore` baseline.
- [ ] Tabs, framework chips, and the overview/crosswalk/control-area views all render from `data/compliance-frameworks.json`.
- [ ] README language says explicitly that the project compares frameworks without claiming they are equivalent.
- [ ] The GitHub Pages path remains safe for static comparison data and relative asset loading.
- [ ] The structure supports future framework additions without changing the no-build-step file format.

## P1 — should pass before first feature-complete share
- [ ] The landing page remains readable at 320px, 768px, and 1440px wide.
- [ ] Keyboard focus is visible and the placeholder page has a logical reading order.
- [ ] Chrome and Edge show no console errors on initial load.
- [ ] The README local-run instructions work exactly as written from the project root.
- [ ] The planned layout can compare several frameworks at once without sacrificing readability.
- [ ] Copilot instructions explicitly warn against false one-to-one framework mapping claims.
- [ ] Placeholder tone feels instructional and careful rather than authoritative beyond its scope.
- [ ] The shell leaves room for both quick summaries and deeper comparison notes.

## P2 — polish and follow-up checks
- [ ] A fresh screenshot can eventually be dropped into `docs/screenshot.png` without changing the README contract.
- [ ] The roadmap still reflects useful next iterations instead of vague wishlist items.
- [ ] The repo still feels intentionally lightweight, with no accidental build tooling added.
- [ ] The placeholder page looks acceptable in both light and dark system themes.
- [ ] Roadmap items focus on clearer comparison dimensions and misconceptions.
- [ ] The README has a clean placeholder for a screenshot of the comparison table.
- [ ] The repo remains understandable to readers who are not yet compliance specialists.
- [ ] The structure can absorb more frameworks later only if the comparison model stays readable.
