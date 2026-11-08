# YSLRP — Scroll Cinema (v8)

An independent landing site for the fictional Saint Laurent GTA V/FiveM roleplay server. Intentionally **not** a duplicate of the existing mainland website.

## Technology and deployment

- Pure HTML + CSS + vanilla JavaScript; no build step, no database, no user accounts, no back end, no CDN script/runtime, no paid Cloudflare dependency.
- Scroll narrative adapts pinned/scrubbed scroll-staging ideas from public GSAP ScrollTrigger and Codrops examples, but the implementation in this repository is **original vanilla JS**. No third-party example code or assets were copied.
- Cloudflare Pages (Git integration): root `/`, build command *empty*, output `/` (or `.` as accepted by UI), static files at repository root.
- Custom domains currently assigned to this project: `yslrp.com` and `www.yslrp.com`.
- Mobile, keyboard, and `prefers-reduced-motion` support. Native scrolling retained, native scrollbar visually hidden, no forced wheel interception or scroll-jacking.
- Site presentation right-click: contextual menu on non-interactive visual regions only; links, text selection, inputs, and keyboard navigation remain available.

## Naming and locales

International brand: **YSLRP**. Chinese descriptor: **圣罗兰角色扮演**. English descriptor: **Saint Laurent Roleplay**.
Two fully translated content languages: `zh-CN` and `en`, auto-detected from the browser language and manually switchable. Preference is stored locally in the browser only.

## Truthfulness

- This site is an *introduction* to a fictional GTA V / FiveM RP environment, not a direct replica of the game, and the art is not actual server screenshots.
- Published information: Chinese voice-oriented light RP, no-whitelist entry and `connect pga8dp7`; subject to latest official updates.
- No invented online-player counts, real-time API claims, or server status values.
- KOOK join link and FiveM entry link are explicit outbound actions.

## Quality checks

`node --check app.js`, local image/size manifest and browser (desktop and mobile) visual testing required before publishing production. Branch preview first; production only after review.
