# Design QA

## Source and target

- Visual source of truth:
  `/Users/guanchao/.codex/generated_images/019f8e56-7a2f-7b30-a1d7-3c0910524170/call_SmDkZel3AScMyXb3DRTx23Yt.png`
- Focused museum source:
  `/Users/guanchao/.codex/generated_images/019f8e56-7a2f-7b30-a1d7-3c0910524170/call_4W5EBwb0tAETWrhXny3RsJyX.png`
- Source dimensions: 748 × 2103 px.
- Combined full-page comparison:
  `qa/compare-full-page-pass2.png` (source left, implementation section captures right).

## Tested viewports and states

- Desktop baseline: 1280 × 720 CSS px, DPR 2.
- Desktop expanded verification: 1334 × 1171 CSS px, DPR 2.
- Mobile content viewport: 390 × 844 CSS px, DPR 2.
- States reviewed:
  - hero at page start;
  - manifesto and complete journey;
  - both museum choices, including selected state;
  - real registration QR dialog;
  - collection form validation;
  - archive filtering and detail dialog;
  - downloadable archive card;
  - mobile navigation, journey, museum choice, and archive.

## Evidence

- Desktop:
  - `qa/implementation-desktop-hero-pass2b.png`
  - `qa/implementation-desktop-journey-pass2.png`
  - `qa/implementation-desktop-museum-selected.png`
  - `qa/implementation-desktop-qr-modal.png`
  - `qa/implementation-desktop-form-validation.png`
  - `qa/implementation-desktop-archive-detail.png`
- Mobile:
  - `qa/implementation-mobile-hero-pass2b.png`
  - `qa/implementation-mobile-journey-pass1.png`
  - `qa/implementation-mobile-museum-pass1.png`
  - `qa/implementation-mobile-archive-pass1b.png`

## Interaction checks

| Check | Result |
| --- | --- |
| Desktop and mobile navigation | Passed |
| Registration CTA opens the supplied WeChat QR | Passed |
| QR dialog closes by its close control | Passed |
| Either museum can be selected and visually expands | Passed |
| Form blocks a submission without both required image groups | Passed |
| Archive museum filter updates the visible count (FAM: 3) | Passed |
| Archive tile opens its numbered detail card | Passed |
| Card download action completes and changes state | Passed |
| Browser console | Passed; no new application errors after fixes |
| Production build and Sites worker tests | Passed |

The in-app browser does not expose a file chooser setter, so an automated local
file-selection run was not available. The file controls, preview rendering,
client compression path, and server payload contract were reviewed directly;
the missing-file state was exercised in the browser.

## Findings and fixes

### Pass 1

- P2: the official WaytoAGI SVG only exposed its small color mark on the light
  hero background, leaving the initiator name too weak. Fixed by retaining the
  official mark and pairing it with a live `WaytoAGI` label.
- P2: the desktop fishbone was taller than a single process view, so the full
  participation path could not be understood at once. Fixed by reducing desktop
  vertical spacing and fitting all nine nodes, including the event-day schedule,
  into one 663 px section.
- P2: an archive card could reuse the same React key when carrier and material
  tags shared a label. Fixed by keying rendered tags by label and position.

### Pass 2

- No remaining P0, P1, or P2 visual or interaction issues.
- P3: the source mock uses denser ornamental flourishes between sections. The
  implementation keeps the same ribbon language but uses fewer flourishes to
  protect live text legibility and mobile performance.
- The functional collection form extends the page beyond the static source
  mock. This is an intentional product expansion, not a source mismatch.

## Final result

passed
