# Design System — E-Library Marketplace

Status: living document. Update whenever a token changes.

## Direction
Editorial digital library — calm, readable, premium, modern. Books are
visually dominant; dashboards are clear, not decorative.

## Color tokens (light theme)

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#176B52` | Primary actions, links, active nav |
| `--color-primary-hover` | `#115541` | Hover/active state of primary |
| `--color-secondary` | `#DDECE4` | Secondary surfaces, subtle highlight |
| `--color-accent` | `#E8AD55` | Rare highlights only (badges, featured) |
| `--color-bg` | `#F7F8F5` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-text` | `#1E2924` | Main text |
| `--color-text-muted` | `#66736C` | Secondary/supporting text |
| `--color-border` | `#E2E8E3` | Dividers, input borders |
| `--color-success` | `#1F7A4D` | Success states |
| `--color-warning` | `#A96512` | Warning states |
| `--color-danger` | `#B42318` | Errors, destructive actions |

Dark theme values are defined in `frontend/src/index.css` under
`[data-theme="dark"]`. Status colors must stay legible in both themes and
never be the only indicator of meaning (always pair with icon/text/label).

60/30/10 rule: ~60% neutral background, ~30% primary/surface structure,
~10% accent highlights.

## Typography
- Font: Inter (UI + headings + body, one family for consistency).
- Body base size: 16px. Line height 1.5–1.7 for reading-heavy text.
- Supporting/small text: minimum 12–14px. Never use tiny text for prices
  or critical errors.

## Layout
- Max content width: 1200–1440px depending on page density.
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64.
- Card radius: 12–16px. Input radius: 8–12px. Button height: 40–48px.

## Z-index tokens
| Token | Value | Usage |
|---|---|---|
| `--z-sticky-header` | 30 | Sticky top nav |
| `--z-popover` | 40 | Dropdowns, tooltips, popovers |
| `--z-modal` | 50 | Dialogs |
| `--z-toast` | 60 | Toast notifications |
| `--z-reader-toolbar` | 35 | Reader mode floating toolbar |
| `--z-chat-launcher` | 45 | Chat widget launcher/panel |

## Motion
- Small interactions: 150–250ms transitions.
- Respect `prefers-reduced-motion`; disable non-essential animation when set.
- Reader mode: no distracting motion, ever.

## Breakpoints (Tailwind defaults used as-is)
`sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px · `2xl` 1536px.
No layout should horizontally overflow at 360px width.