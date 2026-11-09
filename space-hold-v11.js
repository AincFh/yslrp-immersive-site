/*
 * YSLRP — Continuous Space-to-Scroll input controller (v11.1)
 * Hold Space: scroll continuously (not a repeated native page jump).
 * Shift+Space: reverse. Release: stop. Keeps focusable controls usable.
 * Uses the same Lenis/ScrollTrigger scroll state as mousewheel/touch.
 */
(() => {
  'use strict';
  let held = false;
  let direction = 1;
  let raf = 0;
  let last = 0;
  let requested = 0;
  let frames = 0;
  const maxY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const speed = () => clamp(window.innerHeight * 0.68, 400, 680);
  const lenis = () => window.__yslrpLenis;
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ignore = (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return true;
    const el = document.activeElement;
    if (!el) return false;
    if (el.closest('input, textarea, button, select, summary, [contenteditable="true"], [role="button"], [role="textbox"], [role="combobox"], [role="dialog"]')) return true;
    if (!document.getElementById('mobileMenu')?.inert) return true;
    if (!document.getElementById('langMenu')?.hidden) return true;
    if (!document.getElementById('contextMenu')?.hidden) return true;
    return false;
  };
  const getScroll = () => {
    const l = lenis();
    return Number.isFinite(l?.animatedScroll) ? l.animatedScroll : window.scrollY;
  };
  const stop = () => {
    held = false;
    last = 0;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
  const tick = (now) => {
    if (!held) return;
    const dt = last ? Math.min((now - last) / 1000, 0.040) : 0;
    last = now;
    if (dt > 0) {
      requested = clamp(requested + direction * speed() * dt, 0, maxY());
      const l = lenis();
      if (l) {
        // Zero interpolation for the input stream: a smooth, constant-speed
        // position update once per frame; GSAP timelines handle visual easing.
        l.scrollTo(requested, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: requested, behavior: 'instant' });
        window.ScrollTrigger?.update();
      }
      frames++;
    }
    raf = requestAnimationFrame(tick);
  };
  document.addEventListener('keydown', (event) => {
    if (event.code !== 'Space' && event.key !== ' ' && event.key !== 'Spacebar') return;
    if (ignore(event)) return;
    event.preventDefault(); // Defeat default repeated page scrolling.
    direction = event.shiftKey ? -1 : 1;
    if (held) return; // Repeated keydown does not create extra animation loops.
    held = true;
    frames = 0;
    requested = getScroll();
    last = 0;
    raf = requestAnimationFrame(tick);
    document.documentElement.classList.add('space-scrolling');
  }, { capture: true, passive: false });
  document.addEventListener('keyup', (event) => {
    if (event.code !== 'Space' && event.key !== ' ' && event.key !== 'Spacebar') return;
    stop();
    document.documentElement.classList.remove('space-scrolling');
  }, { capture: true });
  window.addEventListener('blur', stop);
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  // Explicit pointer/wheel/touch input takes precedence over keyboard-hold scrolling.
  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  window.__YSLRP_SPACE_HOLD = {
    get held() { return held; },
    get direction() { return direction; },
    get frames() { return frames; },
    get targetScroll() { return requested; },
    get speed() { return speed(); },
    stop
  };
})();
