# Ares Vault

Ares Vault is a simple and secure single-page web dashboard that generates strong, memorable passwords from personal anchors: Name, Date of Birth (DOB), Favorite Color, and a Custom Word.

## Features

- **Personal Seed Synthesis**: Intelligently combines Name, Date of Birth, Favorite Color, and Custom Word.
- **8 Simultaneous Credential Archetypes**:
  1. **Fortress Tactical (Primary)**: High-complexity combination with leetspeak, boundary symbols, and cryptographic salt.
  2. **Memorable Passphrase**: Clean, hyphenated readable words for touch keyboards and effortless recall.
  3. **Ultra High-Entropy**: Interleaved component sequences for maximal brute-force resilience.
  4. **Alphanumeric PIN / Compact**: Clean symbol-free format for systems with symbol restrictions.
  5. **Titanium Leet**: Full-substitution format meeting enterprise password standards.
  6. **Alternating Wave**: Rhythmic dynamic casing pattern.
  7. **Minimalist Dot Vault**: Structured hierarchical notation for developers and terminals.
  8. **Interleaved Matrix**: Multi-symbol framing preventing automated dictionary attacks.
- **Theme Support**: Pure Black Dark Mode and Clean White Light Mode with instant toggle.
- **Live Password Strength Analyzer**: Real-time evaluation of Shannon entropy and crack time estimates.
- **Complexity Tuning Drawer**: Toggles for Leetspeak substitution, special symbols, cryptographic salt, uppercase enforcement, and separator choice.
- **100% Client-Side**: No servers, no network calls, zero logs, complete privacy.

## Quick Start

Open `index.html` directly in any web browser:
```bash
xdg-open index.html
```

Or start a local server:
```bash
python3 -m http.server 8080
```

## Repository Structure

```
aresvault/
├── index.html        # Single-page web application and usage guide
├── style.css         # Styling for Light and Pure Black Dark themes
├── app.js            # Password generation algorithms and theme toggle
├── README.md         # Project documentation
└── .gitignore        # Git ignore configurations
```
