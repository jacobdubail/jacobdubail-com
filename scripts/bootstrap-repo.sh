#!/usr/bin/env bash
# Initialise git, create a PRIVATE GitHub repo, and push.
# Usage: ./scripts/bootstrap-repo.sh [owner/name]   (default: jacobdubail/jacobdubail.com)
set -euo pipefail

REPO="${1:-jacobdubail/jacobdubail.com}"
cd "$(dirname "$0")/.."

command -v gh >/dev/null || { echo "Install the GitHub CLI first: brew install gh && gh auth login"; exit 1; }

if [ ! -d .git ]; then
  git init -b main
fi
git add -A
git commit -m "Initial commit: Next.js 16 + Payload 3 rebuild of jacobdubail.com" || true

if ! gh repo view "$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --private --source . --remote origin --push
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
  git push -u origin main
fi

echo "Pushed to https://github.com/$REPO"
