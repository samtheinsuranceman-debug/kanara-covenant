/**
 * Living Pulse v1.0 - 90bpm Covenant Heartbeat (JS Sync Engine)
 * 
 * Pure vanilla JS. No dependencies.
 * 
 * Core principle for cross-page / cross-load sync:
 * All timing derives from absolute wall-clock time (Date.now()).
 * Every element computes the exact same phase at any given millisecond,
 * regardless of when its page loaded or when the script initialized.
 * 
 * This makes the heartbeat feel like a single living heart across the entire
 * Kanara Covenant experience — Home → Brotherhood calibration → Russell
 * Capital dashboards — symbolizing one unified Covenant rhythm.
 * 
 * 90 BPM chosen for:
 * - Human resting heart rate (calm, sustainable, present)
 * - "Brotherhood calibration" metaphor: not rushed, not asleep
 * - Musical/ritual resonance (many traditions use ~90-100 as grounded tempo)
 * 
 * Usage (auto-inits on DOMContentLoaded):
 *   <div class="living-pulse">❤️ Covenant Heart</div>
 *   <div class="pulse-kpi" data-living-pulse>Portfolio Health</div>
 * 
 * Advanced:
 *   window.LivingPulse.setIntensity(0.7); // 0-1
 *   window.LivingPulse.pause();
 *   window.LivingPulse.resume();
 */

(function () {
  'use strict';

  const BPM = 90;
  const BEAT_MS = 60000 / BPM; // 666.666...
  const BREATHE_MS = 5400;

  // Fixed epoch so phase is consistent even across browser restarts / different days
  // (Chosen as a symbolic "Covenant founding" timestamp in 2026)
  const EPOCH = Date.UTC(2026, 4, 1, 0, 0, 0); // May 1, 2026 UTC

  let rafId = null;
  let intensity = 1.0;
  let isPaused = false;
  let elements = [];

  function getPhase() {
    const now = Date.now();
    const elapsed = now - EPOCH;
    const beatPhase = (elapsed % BEAT_MS) / BEAT_MS; // 0..1
    const breathePhase = (elapsed % BREATHE_MS) / BREATHE_MS;
    return { beat: beatPhase, breathe: breathePhase, elapsed };
  }

  function computeHeartbeatScale(phase) {
    // Realistic lub-dub curve (fast attack, two peaks)
    const p = phase;
    let s = 1.0;

    // Lub peak (stronger)
    if (p < 0.14) {
      const t = p / 0.14;
      s = 1 + 0.12 * Math.sin(t * Math.PI); // quick rise/fall
    } 
    // Short valley
    else if (p < 0.22) {
      const t = (p - 0.14) / 0.08;
      s = 1 - 0.02 * Math.sin(t * Math.PI);
    }
    // Dub (softer)
    else if (p < 0.42) {
      const t = (p - 0.22) / 0.20;
      s = 1 + 0.07 * Math.sin(t * Math.PI * 0.9);
    }
    // Return to baseline
    else {
      const t = (p - 0.42) / 0.58;
      s = 1 - 0.01 * (1 - Math.cos(t * Math.PI)) * 0.5;
    }
    return 1 + (s - 1) * intensity;
  }

  function computeBreathe(phase) {
    // Slow, organic breathing (mostly scale + subtle glow via CSS filter in practice)
    const p = (Math.sin(phase * Math.PI * 2) + 1) / 2; // 0..1 smooth
    const scale = 1 + (p - 0.5) * 0.022 * intensity;
    return { scale };
  }

  function updateElement(el, phases) {
    if (!el || isPaused) return;

    const beatScale = computeHeartbeatScale(phases.beat);
    const breathe = computeBreathe(phases.breathe);

    const finalScale = beatScale * breathe.scale;

    // Primary transform (GPU)
    el.style.transform = `scale(${finalScale.toFixed(4)})`;

    // Optional: dynamic filter for "life" (gold-red breath)
    const breathMix = Math.sin(phases.breathe * Math.PI * 2) * 0.5 + 0.5;
    const goldBoost = breathMix * 0.12 * intensity;
    const redBoost = (1 - breathMix) * 0.06 * intensity;

    if (el.classList.contains('pulse-emblem') || el.hasAttribute('data-emblem')) {
      el.style.filter = `brightness(${1 + goldBoost * 0.6}) saturate(${1 + goldBoost}) drop-shadow(0 0 ${4 + goldBoost * 18}px rgba(244,211,94,${0.15 + goldBoost * 0.35}))`;
    } else if (el.classList.contains('pulse-kpi') || el.classList.contains('pulse-card')) {
      el.style.filter = `brightness(${1 + redBoost * 0.4 + goldBoost * 0.3})`;
    }
  }

  function tick() {
    if (isPaused) {
      rafId = null;
      return;
    }

    const phases = getPhase();

    // Update all registered elements
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (!el || !document.body.contains(el)) {
        elements.splice(i, 1); // cleanup removed nodes
        continue;
      }
      updateElement(el, phases);
    }

    rafId = requestAnimationFrame(tick);
  }

  function startTicking() {
    if (rafId != null) return;
    rafId = requestAnimationFrame(tick);
  }

  function stopTicking() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Public API
  const LivingPulse = {
    /**
     * Attach pulse behavior to an element (or selector results).
     * Elements get the living heartbeat + breathing in perfect global sync.
     */
    attach(elOrSelector) {
      const els = typeof elOrSelector === 'string' 
        ? document.querySelectorAll(elOrSelector)
        : (elOrSelector instanceof NodeList ? elOrSelector : [elOrSelector]);

      Array.from(els).forEach(el => {
        if (!el || elements.includes(el)) return;

        // Ensure base class for CSS fallback / theming
        el.classList.add('living-pulse');

        elements.push(el);

        // Initial sync (prevents FOUC)
        const phases = getPhase();
        updateElement(el, phases);
      });

      startTicking();
      return this;
    },

    /** Auto-discover and attach to all .living-pulse, [data-living-pulse], .pulse-* on page */
    attachAll() {
      const selectors = [
        '.living-pulse',
        '.pulse-emblem',
        '.pulse-kpi',
        '.pulse-card',
        '[data-living-pulse]',
        '.covenant-heart'
      ].join(',');
      this.attach(selectors);
      return this;
    },

    detach(elOrSelector) {
      const els = typeof elOrSelector === 'string'
        ? document.querySelectorAll(elOrSelector)
        : [elOrSelector];

      Array.from(els).forEach(el => {
        const idx = elements.indexOf(el);
        if (idx > -1) elements.splice(idx, 1);
        if (el) {
          el.style.transform = '';
          el.style.filter = '';
          el.classList.remove('living-pulse');
        }
      });
      if (elements.length === 0) stopTicking();
      return this;
    },

    setIntensity(val) {
      intensity = Math.max(0, Math.min(1, parseFloat(val) || 1));
      return this;
    },

    getIntensity() { return intensity; },

    pause() {
      isPaused = true;
      stopTicking();
      // Freeze current visual state
      elements.forEach(el => {
        if (el) el.style.animationPlayState = 'paused';
      });
      return this;
    },

    resume() {
      isPaused = false;
      elements.forEach(el => {
        if (el) el.style.animationPlayState = 'running';
      });
      startTicking();
      return this;
    },

    /** Force immediate resync (useful after heavy DOM changes) */
    resync() {
      const phases = getPhase();
      elements.forEach(el => updateElement(el, phases));
      return this;
    },

    /** For debugging / theme demos */
    getDebugInfo() {
      const p = getPhase();
      return {
        bpm: BPM,
        beatMs: BEAT_MS,
        phaseBeat: p.beat.toFixed(4),
        phaseBreathe: p.breathe.toFixed(4),
        intensity,
        attachedCount: elements.length,
        epoch: new Date(EPOCH).toISOString()
      };
    }
  };

  // Auto-init + global exposure
  function autoInit() {
    // Respect reduced motion at init
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--pulse-intensity', '0.15');
      return; // CSS will handle subtle static treatment
    }

    // Attach everything present on load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        LivingPulse.attachAll();
      });
    } else {
      LivingPulse.attachAll();
    }

    // Re-attach on dynamic content (e.g. after calibration render)
    const mo = new MutationObserver(() => {
      if (!isPaused) LivingPulse.attachAll();
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // Expose for console / other scripts / calibration tool
    window.LivingPulse = LivingPulse;
    window.CovenantPulse = LivingPulse; // thematic alias

    // Keyboard hint (dev)
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log('%c[Kanara Covenant] Living Pulse v1.0 ready. window.LivingPulse for controls. 90bpm synced globally.', 'color:#f4d35e');
    }
  }

  autoInit();

  // Bonus: allow data-intensity="0.6" on elements
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-intensity]').forEach(el => {
      const val = parseFloat(el.dataset.intensity);
      if (!isNaN(val)) {
        // Per-element intensity not fully supported in v1 (global), but we can note it
        el.dataset.pulseIntensity = val;
      }
    });
  });

})();