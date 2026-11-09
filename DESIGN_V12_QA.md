# YSLRP Editorial Cinema v12 — Visual Direction & Preview QA

**Scope:** Independent YSLRP overseas landing page. This is an isolated design branch, not an ICP/DNS or production update.

**Preview:** https://design-editorial-cinema-v12.yslrp-immersive-site.pages.dev/

## Art direction

The v11 visual hierarchy was too uniform: oversize heavy sans headings, pink/purple ornament, rectangular text-only cards and repeated section compositions. V12 replaces this with a cinematic editorial/photographic system:

- Palette: mineral charcoal, warm gallery paper, aged rose/copper details; deliberately fewer saturated colors.
- Typography: Chinese Songti-style editorial display and quiet sans body copy; Roman italic as restrained marginalia, not body clutter.
- Composition: deliberately asymmetric photographic spreads, much more negative space and mixed light/dark chapters.
- Role narratives: four distinct existing site photographs, replacing solid gradient card backgrounds.
- RP experience: photographic journaling motif beneath the interactive choices; interaction still works.
- Motion: retains Lenis/GSAP and v11.2 held-Space controller, with no second scroll input clock or wheel hijack.
- Original brand assets and the GTA V / FiveM fictional-community disclaimers retained. No new factual claims or external image URLs.

## Verified preview behavior

- Browser preview loaded the v12 stylesheet and module, `__YSLRP_ART_DIRECTION.version=12.0.0`.
- Desktop viewport 1440×900: cinematic hero title and CTA visible; bottom CTA ends at pixel 701, bottom line begins at 826; **no overlap**.
- Desktop role spread: 4 images loaded successfully. City/mountain/people scenes are visually differentiated.
- Mobile 390×844: hero and editorial chapters rendered; `documentElement.scrollWidth-innerWidth=0`.
- Mobile manifesto: fixed off-screen positioning; image visible at 39px–351px, text begins below it, **0px vertical overlap** at the inspected scroll point.
- Language switch: EN and Chinese states updated both title and hero text successfully.
- External service links remain unchanged: FiveM `https://cfx.re/join/pga8dp7` and KOOK `https://kook.vip/eo8Jcl`.
- Mobile Lighthouse (navigation, one test): Accessibility **96**, Best Practices **100**, SEO **69**, Agentic Browsing **96**. SEO needs separate investigation; do not represent this preview as SEO-approved.

## Remaining quality gates before merging

1. Human visual review of the new art direction, not merely code review.
2. Actual physical held-Space and wheel scrubbing on foreground desktop Edge/Chrome (the remote automation engine can throttle rAF).
3. Mobile horizontal role-card transition readability and touch behavior on a real device.
4. More extensive breakpoints at 768, 1024, 1440, 1920px, zoom 125%/200%, keyboard accessibility, reduced-motion.
5. Performance on mid-range phones: frame times, LCP, decode pressure from embedded base64 illustration frames.
6. Follow up on mobile Lighthouse SEO score 69; protect canonical production domains and do not index preview as production.
7. Do not merge to `main`, change `yslrp.com` or touch `yslfivem.com`/ICP unless explicitly approved.

## Key files

- `art-direction-v12.css`: new visual grammar, type and responsive layout.
- `art-direction-v12.js`: non-destructive photographic panels, marginalia and editorial accents.
- `index.html`: references those files.
- `motion-v11.js`, `space-hold-v11.js`: unchanged scroll systems from parent branch.
