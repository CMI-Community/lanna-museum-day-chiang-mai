# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Locked Product And Design Decisions

- Selected visual target: `/Users/guanchao/.codex/generated_images/019f8e56-7a2f-7b30-a1d7-3c0910524170/call_SmDkZel3AScMyXb3DRTx23Yt.png`.
- Dominant visual language: lively modular editorial layout, warm ivory canvas, Lanna purple primary color, restrained CMI accent colors, and no gradients.
- Navigation brand: real CMI Community logo and text. WaytoAGI is credited as initiator in the Hero and activity body.
- Hero partner credit uses the transparent-background WaytoAGI mark with a dark wordmark; do not place it on a filled badge. The adjacent venue credit reads “CMI Community 主办 清迈线下场”.
- Search and social metadata must foreground “7月26日”, “AI 切磋大会”, and “CMI STUDIO”, and use the dedicated 1200 × 630 branded PNG at `public/assets/social/lanna-museum-day-og.png`.
- Poster layouts must preserve the background artwork's flowing curves and open space: do not add top color bars, framed bottom information strips, logo backplates, or rectangular task cards. Let typography and calls to action breathe directly on the image, using only the QR code's required white quiet zone.
- Hero hierarchy: “共同探寻兰纳 Lanna 纹案的踪迹” is the primary graphic headline; “AI 切磋大会第 26 期” and “博物馆奇妙日·清迈场” share a smaller level.
- Page order is fixed: Hero → submitted-works showcase → artistic activity manifesto → complete fishbone journey/day schedule → full-screen museum selection → collection portal/modal wizard → newest-first archive grid.
- The submitted-works showcase is the second screen. Every work card contains a cover, title, short introduction, and explicit creator credit; website works may open externally and video covers must be extracted from their actual files rather than represented by unrelated imagery.
- Do not reintroduce the removed four-column explainer between Hero and journey.
- Registration uses the real replaceable WeChat group QR in `public/assets/registration/`.
- Pattern submission uses a rotated server-side event access code and Supabase persistence. Case and whitespace normalization is performed in the Edge Function; the client and repository must never contain the real code or service-role credentials.
- Museum cards use Lanna-pattern borders and link to each museum's official website and map; do not restore selected-state buttons, selected badges, or the central “或” marker.
- Collection is opened from a decorated card entry and completed in a three-page modal: 01 → 02+03 → 04. Each image picker exposes distinct upload and camera actions.
- The public archive is connected to the approved Supabase project. Keep one canonical record when preview samples reuse the same image; remove confirmed duplicate sample records instead of presenting them as distinct finds.
- Archive grid thumbnails always show the collector name. The detail gallery uses clickable thumbnails that open a full-screen, keyboard-accessible viewer with previous/next navigation.
- Curatorial regrouping follows the photographed object, not shooting adjacency or room labels: generic exhibition text must not become a pattern cover or be treated as a single-object label.
- After the archive, keep the AI possibility generator lightweight: one current pattern, optional medium filters, one large editorial IDEA, and one “再来一个 IDEA” action. Generated prompts must state angle, materials, output, and AI value while retaining source and marking all invention as `REIMAGINED / 创意再表达`.
- The creation video follows the generator and precedes the footer. Present it as an AI creative example and explicitly label it as non-historical imagery.
- The public presentation is trilingual: Chinese, Thai, and English. Keep the language switch visible in the fixed header on mobile, preserve `?lang=th` and `?lang=en` as directly shareable presentation links, and localize page metadata, controls, forms, archive records, export cards, and IDEA output together.
- Thai and English archive views must preserve provenance boundaries. Translate current public records and collector credits without turning `UNKNOWN`, unverified AI interpretation, or missing object labels into museum-verified facts.
