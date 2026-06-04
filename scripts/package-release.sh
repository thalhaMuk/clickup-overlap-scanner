#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="$(node -p "require('${ROOT_DIR}/manifest.json').version")"
PACKAGE_NAME="clickup-overlap-scanner-v${VERSION}"
DIST_DIR="${ROOT_DIR}/dist"
STAGING_DIR="${DIST_DIR}/${PACKAGE_NAME}"
ZIP_PATH="${DIST_DIR}/${PACKAGE_NAME}.zip"

rm -rf "${STAGING_DIR}" "${ZIP_PATH}"
mkdir -p "${STAGING_DIR}"

cp \
  "${ROOT_DIR}/manifest.json" \
  "${ROOT_DIR}/content.js" \
  "${ROOT_DIR}/styles.css" \
  "${ROOT_DIR}/popup.html" \
  "${ROOT_DIR}/popup.css" \
  "${ROOT_DIR}/popup.js" \
  "${ROOT_DIR}/README.md" \
  "${STAGING_DIR}/"

(
  cd "${DIST_DIR}"
  zip -qr "${ZIP_PATH}" "${PACKAGE_NAME}"
)

rm -rf "${STAGING_DIR}"

echo "Created ${ZIP_PATH}"
