# AGENTS.md — Kanara Covenant

This document provides guidance for future Grok Build work on the Kanara Covenant website.

## Project Identity
- **Core Theme**: The Living Covenant Heart at exactly **90 BPM**.
- **Living Pulse v1.0**: The signature synced heartbeat + breathing animation (light red/gold) that must appear consistently across the site.
- **Stack**: Pure vanilla HTML/CSS/JS (no frameworks or build steps unless explicitly approved in a new design phase).
- **Tone**: Solemn yet hopeful, elegant, covenant-focused. Blends spiritual brotherhood with Russell Capital-style stewardship.

## Key Patterns to Preserve

### Living Pulse
- Always include `css/pulse.css` and `js/pulse.js`.
- Use classes: `.living-pulse`, `.pulse-emblem`, `.pulse-kpi`, `.pulse-card`, or `data-living-pulse`.
- The pulse engine is time-based for perfect cross-page and cross-tab synchronization.
- On success states or high-alignment moments, you may temporarily boost intensity using `window.LivingPulse.setIntensity(1.3+)` (return to normal after a tasteful duration).

### Local Development
- Primary tool: `.\serve.ps1` (zero-dependency Windows HTTP server).
- Always test the Living Pulse sync by opening `test-pulse.html` in multiple tabs.

### Navigation & Structure
- All pages must use the shared partials system:
  - `<header data-partial="header"></header>`
  - `<footer data-partial="footer"></footer>`
- Include `js/nav.js` on every page.
- Keep the covenant color system: deep navy (`#0f172a`), charcoal (`#1e2937`), gold (`#f4d35e`), soft red (`#f8b4b4`).

### Content Guidelines
- Every page should participate in the Living Pulse theming.
- New pages should feel like they belong in the same "living covenant" — reference 90 BPM, brotherhood calibration, and stewardship where natural.
- Avoid gold-plating or unnecessary complexity.

## Recommended Workflow for Future Changes
1. Update this plan (or create a new targeted design) before major work.
2. Follow the established PR DAG pattern when possible.
3. Use `serve.ps1` heavily during development.
4. Test Living Pulse synchronization across pages.
5. Run `/check-work` (or `c-w`) focused on pulse integrity + thematic consistency before considering a phase complete.

## Current State (as of latest PR 6)
- Full navigation + partials system
- 8 content pages (index, about, brotherhood, events, join, resources, contact, dashboards)
- Strong Russell Capital-inspired dashboards with real charts
- `serve.ps1` for local development
- GitHub Pages deployment via workflow

## Things to Avoid
- Breaking the global pulse synchronization.
- Introducing build tools or frameworks without a new design phase.
- Outdated language in README (e.g., "coming in the next iteration" for features that now exist).

---

*90 beats. One heart. The Covenant lives.* ♥︎✝︎