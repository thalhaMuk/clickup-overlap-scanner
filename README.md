# ClickUp Overlap Scanner

A small browser extension for finding overlapping time entries in ClickUp Timesheets.

It works in Brave, Chrome, and other Chromium-based browsers that support unpacked extensions.

## Install

### Option 1: Download the release zip

This is the easiest option for most people.

1. Open the latest GitHub Release for this project.
2. Download `clickup-overlap-scanner-v1.0.0.zip`.
3. Extract the zip file.
4. Open Brave or Chrome and go to `brave://extensions` or `chrome://extensions`.
5. Turn on **Developer mode**.
6. Click **Load unpacked**.
7. Select the extracted folder that directly contains `manifest.json`.
8. Open ClickUp Timesheets at `https://app.clickup.com/`.
9. Click the extension icon and choose **Scan for Overlaps**.

If you see **Manifest is missing or unreadable**, you selected the wrong folder. Select the folder that contains `manifest.json`, not the zip file and not the parent Downloads folder.

### Option 2: Clone the repo

```bash
git clone git@github.com:thalhaMuk/clickup-overlap-scanner.git
```

Then use **Load unpacked** and select the cloned repo folder.

## Use

1. Open the ClickUp Timesheet page.
2. Make sure the time entries you want to check are loaded and visible.
3. Open the extension popup.
4. Click **Scan for Overlaps**.
5. Any overlapping entries are highlighted in the timesheet.
6. Click **Clear Highlights** to remove the highlights.

## Package a Release

Maintainers can create the release zip locally:

```bash
scripts/package-release.sh
```

The zip will be written to `dist/`.

## Project Structure

```text
.
├── manifest.json
├── content.js
├── styles.css
├── popup.html
├── popup.css
├── popup.js
├── scripts/
│   └── package-release.sh
└── docs/
    └── releases/
        └── v1.0.0.md
```
