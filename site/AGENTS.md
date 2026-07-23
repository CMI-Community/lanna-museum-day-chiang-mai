# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Locked Product And Design Decisions

- Selected visual target: `/Users/guanchao/.codex/generated_images/019f8e56-7a2f-7b30-a1d7-3c0910524170/call_SmDkZel3AScMyXb3DRTx23Yt.png`.
- Dominant visual language: lively modular editorial layout, warm ivory canvas, Lanna purple primary color, restrained CMI accent colors, and no gradients.
- Navigation brand: real CMI Community logo and text. WaytoAGI is credited as initiator in the Hero and activity body.
- Hero hierarchy: “探寻兰纳 Lanna 纹案的踪迹” is the primary graphic headline; “AI 切磋大会第 26 期” and “博物馆奇妙日·清迈场” share a smaller level.
- Page order is fixed: Hero → artistic activity manifesto → complete fishbone journey/day schedule → full-screen museum selection → collection instructions/form → newest-first archive grid.
- Do not reintroduce the removed four-column explainer between Hero and journey.
- Registration uses the real replaceable WeChat group QR in `public/assets/registration/`.
- Pattern submission uses a server-side event access code and Supabase persistence. The client must never contain the real code or service-role credentials.
