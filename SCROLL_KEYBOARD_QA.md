# YSLRP Scroll Cinema — v11.2 verification

This file records measured behavior of **preview branch** `fix/scroll-motion-engine-v11`. Production `main` and `yslrp.com` are deliberately untouched.

## Target behavior

- Space **held** on document/ordinary link: continuous scroll, no one-page jumps, ~400–680 px/s depending on viewport.
- Shift+Space: continuous reverse scroll; Shift may be changed during hold.
- Repeated Space keydown: **one** controller loop, no cumulative acceleration.
- Releasing Space, tab blur, pagehide, pointer, wheel or touch input: controller releases immediately.
- Form controls, buttons, editable content, open navigation menus, IME candidate selection and reduced-motion settings retain native keyboard semantics.
- Lenis owns scroll input, GSAP ScrollTrigger owns scene progress; there is no alternate `requestAnimationFrame` scene interpolation clock.

## Checks performed in connected Chromium/Edge preview

| Test | Result | Evidence |
| --- | --- | --- |
| Preview loads | PASS | 9 ScrollTrigger timelines; Lenis active; Canvas ready; 21 hero frames |
| External code/assets | PASS | GSAP, ScrollTrigger, Lenis and local scripts returned HTTP 200; 0 broken images |
| JS console | PASS with note | No runtime errors; DevTools reported 1 issue concerning lazy image dimensions |
| Keyboard input dispatch | PASS | Repeated keydown did not create additional held-scroll loops |
| 3-second deterministic 60 Hz hold | PASS | ~1,818px scroll vs ~1,838px expected in first test |
| 18-second deterministic 60 Hz hold | PASS | 11,028px scroll vs 11,028px expected; max sample-to-sample delta 11px; traversed home, manifesto, identity, seam and world |
| Space key release | PASS | No further scrolling observed after release; controller `held=false` and CSS class cleared |
| Focused button | PASS | Synthetic Space was not intercepted on a focused button |
| CJK IME composition | PASS | Synthetic composition was not intercepted |
| 1912px viewport horizontal overflow | PASS | 0px |
| World scene title width | FIXED IN CODE | Preview had computed `.world-copy` width 0px and severe one-character wrapping; CSS width rules added in commit `e6ee297`. Require screenshot after deployment |

**Important testing limitation:** The remote Edge automation environment throttled `requestAnimationFrame` to roughly 1–2 callbacks/second during real-time scripted waits, even with document visibility `visible`. Accordingly the real-time synthetic key hold showed under-speed scrolling; this is not evidence of normal foreground 60 Hz user behavior. The deterministic 60 Hz test validates the controller's math and sequencing, **not** actual display FPS or physical keyboard performance. A physical held-Space test in a foreground browser remains mandatory before merging.

## Before approving the preview for production

1. In an active foreground Edge/Chrome window, physically hold Space for 3 seconds, then 18 seconds; require uninterrupted scene animation, no native page jumps, and immediate stop on keyup.
2. Hold Shift+Space after scrolling partway; confirm smooth reverse progression and no jump.
3. Repeat while the language menu is open, a button has focus, an editable input is focused, and a Chinese IME is composing.
4. Scroll wheel and touch inputs should take over from keyboard. Inspect reduced-motion behavior separately.
5. Validate visual transitions at 390px and 1440px viewports, including title wrapping, scene masks and horizontal role card progression.
6. Trace FPS/long tasks on real hardware. Do not claim the 60 FPS target solely from deterministic simulation.
7. Verify the latest Cloudflare Pages deployment contains `space-hold-v11.js` v11.2 and `motion-v11.css` corrected `.world-copy` width before any merge.

## Deployment boundary

Source: [AincFh/yslrp-immersive-site](https://github.com/AincFh/yslrp-immersive-site). Preview: https://fix-scroll-motion-engine-v11.yslrp-immersive-site.pages.dev/ . Do not change DNS, ICP configuration, `yslfivem.com` or production `main` as part of this interaction QA.
