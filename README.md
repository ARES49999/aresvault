# Ares Vault

Ares Vault is a professional single-page web dashboard for synthesizing high-entropy, deterministic passwords from personal cognitive anchors: name/handle, date of birth (DOB), favorite color, and a custom anchor word or token.

Engineered with clean white UI aesthetics inspired by **Linear**, **Stripe**, and **Emil Kowalski's Design Engineering principles**.

## Design & Craft Standards

- **Clean White Canvas**: Hairline borders (`#e2e8f0`), subtle elevation shadows, and high-density information layout.
- **Micro-Interaction Craft**:
  - Tactile button press responsiveness (`transform: scale(0.98)` on `:active`).
  - Strict typography discipline: Inter font with `-0.02em` tracking on large numerals and headings.
  - Number stabilization: `font-variant-numeric: tabular-nums` to eliminate layout jitter.
  - Optimal text readability: Paragraph lines capped at `max-width: 65ch`.
  - Floating Sonner-style toast notifications for instantaneous copy feedback.
- **Zero Emojis**: 100% vector SVG iconography adhering to strict enterprise standards.
- **100% Client-Side Memory Sandbox**: All computations occur locally in the browser runtime via W3C Web Crypto. No data is logged, transmitted, or stored.

## Features

- **Personal Seed Synthesis**: Intelligently combines Name, Date of Birth (year, month, day extraction), Favorite Color (interactive swatches + custom input), and Custom Anchor Word.
- **8 Simultaneous Credential Archetypes**:
  1. **Fortress Tactical (Primary)**: High-complexity leetspeak with boundary symbols and cryptographic salt.
  2. **Memorable Passphrase**: Clean, hyphenated readable words for touch keyboards and effortless human recall.
  3. **Ultra High-Entropy**: Interleaved component sequences for maximal brute-force resilience.
  4. **Alphanumeric PIN / Compact**: Clean symbol-free format for legacy login portals with symbol limits.
  5. **Titanium Leet**: Advanced full-substitution meeting stringent enterprise compliance.
  6. **Alternating Wave**: Rhythmic dynamic casing pattern.
  7. **Minimalist Dot Vault**: Structured hierarchical notation for developer and terminal workflows.
  8. **Interleaved Matrix**: Multi-symbol framing preventing automated dictionary and pattern attacks.
- **Live Password Strength Analyzer**: Real-time evaluation of Shannon entropy (in bits) and calculated brute-force crack time estimates.
- **Complexity Tuning Drawer**: Toggles for Leetspeak substitution, special symbols, cryptographic salt injection, uppercase enforcement, and customizable passphrase separators.
- **Comprehensive Usage & Architecture Guide**: Built directly into the single page.

## Architecture and File Structure

```
aresvault/
├── index.html        # Single-page HTML application and usage guide
├── style.css         # Linear x Stripe light dashboard styling and craft transitions
├── app.js            # Generation algorithms, entropy calculator, and event handling
├── README.md         # Documentation, usage guide, and changelog
└── .gitignore        # Standard Git ignore configurations
```

## Quick Start

### Direct Browser Usage
Open `index.html` directly in any modern web browser:
```bash
# On Linux
xdg-open index.html

# On macOS
open index.html

# On Windows
start index.html
```

### Local Development Server
```bash
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

## Update Log / Changelog

### Version 2.1.0 (Clean White Professional Dashboard Redesign)
- Replaced previous dark design with a clean, high-density white dashboard UI inspired by Linear, Stripe, and Emil Kowalski craft principles.
- Added tabular numeral alignment (`font-variant-numeric: tabular-nums`) across all strength metrics and password strings to eliminate number jitter.
- Implemented tactile micro-interactions with `:active` scaling, precise easing transitions, and a floating Sonner-style toast notification.
- Redesigned color swatches, input forms, and metrics summary strip for maximum contrast and legibility.
- Synchronized all files across active development branch (`dev`) and production (`main`).

### Version 2.0.0 (Initial Rebuild)
- Rebuilt complete single-page Ares Vault web application with seed synthesis algorithms.
- Established dual-branch Git architecture (`dev` and `main`).
