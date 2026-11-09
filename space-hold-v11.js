/*
 * YSLRP — Continuous Space-to-Scroll input controller (v11.2)
 * One held key -> one animation-frame loop -> one Lenis/ScrollTrigger scroll clock.
 * Space / Shift+Space: continuous down / up. Release or competing input: stop.
 * No discrete browser page jumps, repeat-key acceleration or focus hijacking.
 */
(() => {
  'use strict';

  let held = false;
  let direction = 1;
  let raf = 0;
  let last = 0;
  let requested = 0;
  let frames = 0;
  let composing = false;
  let previousFrameGap = 0;

  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const maxY = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const speed = () => clamp(innerHeight * 0.68, 400, 680);
  const lenis = () => window.__yslrpLenis;
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSpace = event => event.code === 'Space' || event.key === ' ' || event.key === 'Spacebar';
  const isControl = element => element instanceof Element && !!element.closest(
    'input, textarea, button, select, summary, [contenteditable]:not([contenteditable="false"]), ' +
    '[role="button"], [role="textbox"], [role="combobox"], [role="dialog"], [aria-modal="true"]'
  );

  const shouldPassThrough = event => {
    // Space also confirms CJK input-method candidates: never seize a composition.
    if (composing || event.isComposing || event.keyCode === 229) return true;
    if (event.ctrlKey || event.metaKey || event.altKey) return true;
    if (reducedMotion() || document.hidden) return true;
    if (isControl(event.target) || isControl(document.activeElement)) return true;
    const mobile = document.getElementById('mobileMenu');
    if (mobile && !mobile.inert) return true;
    const lang = document.getElementById('langMenu');
    if (lang && !lang.hidden) return true;
    const context = document.getElementById('contextMenu');
    if (context && !context.hidden) return true;
    return false;
  };

  const currentScroll = () => {
    const l = lenis();
    return Number.isFinite(l?.animatedScroll) ? l.animatedScroll : window.scrollY;
  };

  function stop() {
    held = false;
    last = 0;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    document.documentElement.classList.remove('space-scrolling');
  }

  function tick(now) {
    if (!held) return;
    if (document.hidden || reducedMotion()) { stop(); return; }

    // Bound the catch-up distance after a long task / tab descheduling.
    // At normal 60/120 Hz this simply tracks the elapsed wall time.
    const gap = Math.max(0, (now - last) / 1000);
    previousFrameGap = gap;
    last = now;
    const dt = Math.min(gap, 0.10);
    if (dt) {
      requested = clamp(requested + direction * speed() * dt, 0, maxY());
      const l = lenis();
      if (l) {
        // Keyboard input supplies a smoothly evolving *position*, not Lenis
        // duration tweens recreated at every frame. GSAP scrubs the scenes.
        l.scrollTo(requested, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: requested, behavior: 'instant' });
        window.ScrollTrigger?.update();
      }
      frames++;
    }
    raf = requestAnimationFrame(tick);
  }

  document.addEventListener('compositionstart', () => { composing = true; stop(); }, true);
  document.addEventListener('compositionend', () => { composing = false; }, true);

  document.addEventListener('keydown', event => {
    if (event.key === 'Shift' && held) {
      direction = -1;
      return;
    }
    if (!isSpace(event)) return;
    if (shouldPassThrough(event)) { if (held) stop(); return; }
    event.preventDefault();
    direction = event.shiftKey ? -1 : 1;
    if (held) return; // keydown auto-repeat must not create a second loop
    held = true;
    frames = 0;
    requested = clamp(currentScroll(), 0, maxY());
    last = performance.now();
    previousFrameGap = 0;
    document.documentElement.classList.add('space-scrolling');
    raf = requestAnimationFrame(tick);
  }, { capture: true, passive: false });

  document.addEventListener('keyup', event => {
    if (event.key === 'Shift' && held) {
      direction = 1;
      return;
    }
    if (isSpace(event)) stop();
  }, true);

  ['blur', 'pagehide'].forEach(name => window.addEventListener(name, stop));
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  document.addEventListener('pointerdown', stop, { passive: true });

  window.__YSLRP_SPACE_HOLD = {
    get version() { return '11.2.0'; },
    get held() { return held; },
    get direction() { return direction; },
    get frames() { return frames; },
    get targetScroll() { return requested; },
    get lastFrameGapMs() { return Math.round(previousFrameGap * 1000); },
    get speed() { return speed(); },
    stop
  };
})();
