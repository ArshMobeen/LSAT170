#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Run this build kit on a Mac."
  exit 1
fi
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Install Node.js 22 LTS or newer from https://nodejs.org, then run this file again."
  exit 1
fi
node -e 'if (Number(process.versions.node.split(".")[0]) < 22) { console.error("Node.js 22 or newer is required."); process.exit(1); }'
echo "Preparing Angel's 170 for Apple Silicon and Intel MacBooks..."
npm ci
npm test
npm run package:mac
echo "Done. Open release, choose the DMG for your Mac, and drag Angels 170 into Applications."
open release
