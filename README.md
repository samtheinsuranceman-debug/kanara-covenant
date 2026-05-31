# Kanara Covenant

**The Living Covenant Heart — 90 BPM**

A sacred brotherhood website uniting spiritual covenant identity, Russell Capital-inspired financial stewardship, and calibrated alignment among brothers.

> **Living Pulse v1.0** — The signature 90bpm heartbeat + breathing animation (light red & warm gold) is **synced across every single page** via a pure vanilla JS time engine. Open any page in multiple tabs or at different times — the pulse remains perfectly locked.

## Core Pages (Current)
- [index.html](index.html) — Hero landing with dominant Living Pulse emblem
- [about.html](about.html) — The Covenant Identity
- [brotherhood.html](brotherhood.html) — Interactive Brotherhood Calibration tool (with live pulsing orb)
- [events.html](events.html) — Gatherings & upcoming events
- [join.html](join.html) — Enter the Pact (commitment form with pulse-modulated success state)
- [resources.html](resources.html) — Teachings and stewardship wisdom
- [contact.html](contact.html) — Contact the Circle
- [dashboards.html](dashboards.html) — Russell Covenant Stewardship dashboards with real interactive charts
- [test-pulse.html](test-pulse.html) — Dedicated verification page (best for testing global 90 BPM sync)

## The Living Pulse (Technical)
- **90 BPM** exactly (`--pulse-beat-ms: 666.67`)
- Heartbeat: realistic lub-dub with two peaks, GPU-accelerated transforms
- Breathing: slow 5.4s golden-red glow/scale overlay (the "breath of the Covenant")
- **Global sync**: All timing derived from fixed `EPOCH` + `Date.now()`. Phase calculation identical on every load.
- Applied to: `.living-pulse`, `.pulse-emblem`, `.pulse-kpi`, `[data-living-pulse]`, etc.
- Respects `prefers-reduced-motion`
- Controls exposed: `window.LivingPulse.pause() / resume() / setIntensity(0.6) / getDebugInfo()`

See `css/pulse.css` and `js/pulse.js` for the full implementation and thematic commentary.

## Covenant Themes
- **Covenant**: Sacred, binding agreement — with the Divine, with brothers, with wise stewardship of wealth and life.
- **Brotherhood Calibration**: Fully interactive tool that measures alignment across Spiritual, Relational, Financial, and Communal dimensions. The pulsing orb and global Living Pulse intensity respond in real time to your score.
- **Russell Capital Stewardship**: Substantial "Living Portfolios" dashboards with real interactive charts, inspired by physician tax-free wealth strategies. All metrics and visualizations participate in the 90 BPM Covenant heart.

## Build & Deploy
Pure vanilla multi-page static site (per design choice for perfect pulse control and simplicity).

**Local preview (recommended on Windows)**:
```powershell
# From inside the project folder
.\serve.ps1
```

This starts a zero-dependency HTTP server on `http://localhost:8080` using built-in .NET components and automatically opens your browser. It is the most reliable option on this machine.

**Cross-platform / Node alternatives**:
```bash
# Python (if you have a full installation)
python -m http.server 8080

# Node (if installed)
npx serve .
```

Open `index.html` or (best for testing) `test-pulse.html` in multiple tabs to verify the 90 BPM Living Pulse stays perfectly synchronized across pages.

**GitHub Pages**: Automatically deployed via GitHub Actions on every push to `main`. 

**One-time setup required**: After first deployment, go to the repo → **Settings → Pages** and set **Source** to "GitHub Actions". The workflow is already configured.

## Grok Build Provenance
This site was created using the full Grok Build agentic workflow:

1. `enter_plan_mode` → thorough exploration (zero prior website code found) + user clarification questions
2. Comprehensive `plan.md` written (architecture, Living Pulse spec, PR DAG outline, risks, success criteria)
3. User approved with `a` ("Yes, start building")
4. Implementation of core Living Pulse v1.0 + skeleton + this README
5. Final migration commit via MCP + agentic review loops

**Exact commit message** (as requested):
```
Grok Build Migration + Living Pulse v1.0 - 90bpm Covenant Heartbeat
```

## Completed in This Phase (PR 1–6)
- Unified navigation system using client-side partials
- All major content pages (Events, Join, Resources, Contact)
- Significantly expanded Russell Covenant Stewardship dashboards with real Chart.js visualizations
- `AGENTS.md` for future Grok Build maintenance
- GitHub Pages deployment workflow (`.github/workflows/deploy-pages.yml`)
- `serve.ps1` as the primary local development tool

The site is now considered a complete, cohesive migration of the Kanara Covenant vision.

Further work should follow the same rigorous design → plan approval → execute-plan loop documented in the project plan.

## License & Attribution
Personal / community project for Kanara Covenant brotherhood.  
Original design and code (especially the Living Pulse engine) created with Grok 4.3.

---

*90 beats. One heart. The Covenant lives.* ♥︎✝︎

Built with ❤️ (and precise timing) by Grok Build.