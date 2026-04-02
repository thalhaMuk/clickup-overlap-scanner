# ClickUp Overlap Scanner (Chrome Extension)

A lightweight Chrome extension that scans ClickUp Timesheet entries and highlights overlapping time ranges.

## Features

- Manual scan from extension popup (`Scan for Overlaps`)
- Detects overlaps per day group
- Highlights conflicting rows directly in ClickUp
- Clear highlights button (`Clear Highlights`)

## Install (Load Unpacked)

1. Download this project (or clone it).
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked**.
5. Select the `extension` folder.
6. Open ClickUp Timesheet (`https://app.clickup.com/*`) and use the extension popup.

## Project Structure

```text
extension/
  ├── manifest.json
  ├── content.js
  ├── styles.css
  ├── popup.html
  ├── popup.css
  ├── popup.js
  ├── README.md
  └── LICENSE
```
