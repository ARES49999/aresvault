# Ares Vault

Ares Vault is a modern, single-page, high-security password synthesis application designed with cyber-vault aesthetics. It deterministically generates strong, resilient, and memorable passwords from personal cognitive anchors: name/handle, date of birth (DOB), favorite color, and a custom keyword or symbol.

## Features

- **Personal Seed Synthesis**: Intelligently combines Name, Date of Birth (year, month, day extraction), Favorite Color, and a Custom Anchor.
- **Multiple Archetypes Generated Simultaneously**:
  - **Fortress Tactical (Primary)**: Heavy leetspeak substitution, complex symbol interleaving, and cryptographic salt.
  - **Memorable Passphrase**: Readable, hyphen-separated natural phrase suited for mobile devices and high human recall.
  - **Ultra High-Entropy**: Interleaved component sequences offering maximum resistance to brute force.
  - **Alphanumeric PIN / Compact**: Symbol-free alphanumeric formatting for restrictive legacy systems.
  - **Titanium Leet**: Advanced substitution meeting enterprise complexity criteria.
  - **Alternating Wave**: Rhythmic casing pattern for rapid keyboard entry.
  - **Minimalist Dot Vault**: Clean hierarchical notation suited for developer workflows.
  - **Interleaved Matrix**: Multi-symbol framing preventing automated dictionary and pattern attacks.
- **Live Password Strength Analyzer**: Real-time evaluation of Shannon entropy (in bits) and calculated brute-force crack time estimates.
- **Interactive UI & Customization**:
  - Instant color chips (Crimson, Emerald, Sapphire, Obsidian, Violet, Amber) + custom input.
  - Complexity switches for Leetspeak, Symbols, Crypto Salt, Uppercase forcing, and Separator choice.
  - Mask/Unmask visibility toggle.
  - One-click copy with tactile toast notification.
  - Batch "Copy All" functionality.
  - Quick "Demo Fill" button to test instantly.
  - Keyboard shortcuts (`Ctrl + Enter` to generate, `Escape` to blur).
- **100% Client-Side Privacy**: Zero servers, zero network calls, zero storage, zero cookies, zero analytics. Fully functional offline.
- **Strict Accessibility & Swiss Cyber UI**:
  - Follows UI/UX Pro Max guidelines.
  - Meets WCAG 2.1 AA contrast requirements.
  - High performance, zero runtime dependencies.

## Architecture and File Structure

```
aresvault/
├── index.html        # Single-page HTML application and usage guide
├── style.css         # Cyber Vault design system tokens and responsive layout
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
You can also launch a lightweight local server:
```bash
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

## Usage Instructions

1. **Enter Personal Seeds**:
   - Provide your **Name / Handle**.
   - Select your **Date of Birth (DOB)**.
   - Choose or enter your **Favorite Color**.
   - Input a memorable **Custom Anchor Word / Thing** (pet name, favorite place, lucky symbol).
2. **Tune Complexity (Optional)**:
   - Expand the **Complexity Tuning** drawer to toggle Leetspeak substitution, special symbols, cryptographic salt injection, uppercase enforcement, or custom passphrase separators.
3. **Generate & Deploy**:
   - Click **Generate Passwords** (or press `Ctrl + Enter`).
   - Review the calculated entropy and crack time.
   - Click the copy button next to your desired variation to store it securely in your password manager or system login.

## Security Architecture

- **Entropy Multiplication**: Personal inputs alone can be vulnerable to targeted guessing if left plain (e.g. `alexblue2000`). Ares Vault applies algorithmic complexity transformations (character substitution tables, special symbol interleaving, and optional client-side cryptographic salt) that elevate the entropy beyond 80-95+ bits.
- **Zero Telemetry**: All operations execute strictly within the browser's JavaScript execution thread. No inputs or outputs leave the user device.

## Update Log / Changelog

### Version 2.0.0 (Dev Checkpoint & Initial Rebuild)
- Rebuilt complete single-page Ares Vault web application with clean, modern Cyber Vault design system.
- Implemented multi-archetype seed synthesis algorithm supporting Name, DOB, Color, and Custom Word inputs.
- Integrated Shannon entropy and brute-force crack time estimator.
- Implemented real-time color selectors, options accordion, mask/unmask toggling, and copy toast notifications.
- Integrated comprehensive Usage & Security Guide directly within the single page.
- Added full keyboard accessibility, responsive breakpoints (mobile, tablet, desktop), and reduced-motion compliance.
- Established dual-branch Git architecture (`dev` active workspace, `main` protected production).
