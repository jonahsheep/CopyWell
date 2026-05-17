# CopyWell

Clean copied text instantly. A lightweight Chrome extension that removes broken line breaks, extra spaces, citation clutter, invisible characters, and weird quotes — while preserving code, bullets, and paragraph structure.

## How it works

1. **Copy** text (Ctrl+C) from PDFs, articles, docs, or any website
2. **Paste** (Ctrl+V) — text comes out clean automatically

No extra steps, no buttons to press.

## Features

- Auto-cleans on copy via `copy` event interception
- Removes duplicate spaces, broken line wraps, invisible Unicode
- Normalizes quotes and dashes
- Strips citation markers like `[1]` and `(2024)`
- Preserves code blocks, bullet lists, and paragraph structure
- Keyboard shortcut: `Alt+Shift+C` to toggle on/off
- Popup toggle for enable/disable
- Works entirely offline

## Usage

| Action | Result |
|--------|--------|
| Ctrl+C | Text is auto-cleaned before reaching clipboard |
| Click extension icon → Clean Clipboard | Manual clean fallback |
| Alt+Shift+C | Toggle cleaning on/off |
| Popup toggle | Enable/disable from toolbar |

## Privacy

CopyClean does **not** upload, store, or transmit clipboard contents anywhere. Everything runs locally in your browser. No accounts, no tracking, no backend.

## Install

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `copyclean` folder

## File structure

```
├── manifest.json
├── content.js          # copy event interception
├── background.js       # service worker (state + keyboard shortcuts)
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── utils/
│   ├── cleaner.js      # main cleaning pipeline
│   ├── unicode.js      # unicode normalization
│   └── detectors.js    # code/bullet/poetry detection
└── icons/
```

## Tech

Chrome Extension Manifest V3 — vanilla JS, no frameworks, no dependencies.
