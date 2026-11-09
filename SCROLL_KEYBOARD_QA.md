# Spacebar Hold Interaction — v11.1

**Required behavior:** When the document or an ordinary link has focus, holding Space moves down at a steady 400–680 px/s (scaled to viewport). Holding Shift+Space goes upward. Repeated keydown events must not accelerate scrolling. Releasing Space cancels the animation-frame input loop immediately. Other scrolling methods remain available. Native button, form, menu and dialog activation is preserved.

**Implementation:** `space-hold-v11.js` supplies a keyboard-input controller. It feeds continuously integrated scroll coordinates into Lenis and ScrollTrigger, replacing the browser's repeated Space page-jump behavior while held. Scroll animation timelines are rendered separately by `motion-v11.js`.

**QA:** Test in actual Chromium/Edge: focus page; hold Space continuously for >= 3 sec; observe scroll samples (no one-page leaps), scene progression, release stop, Shift+Space direction, focused button activation, change language, mobile unaffected, reduced-motion behavior. Test return/back navigation and no JS console errors.
