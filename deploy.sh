#!/usr/bin/env bash
set -euo pipefail

# ---- config ----
BUILD_DIR="dist"
TARGET_BRANCH="gh-pages"
MSG=${1:-"deploy 🚀"}

# figure out your default branch (main/master)
DEFAULT_BRANCH=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's|origin/||')
DEFAULT_BRANCH=${DEFAULT_BRANCH:-main}

echo "➡️  Building for GitHub Pages…"
rm -rf "$BUILD_DIR"
npm run build

echo "➡️  Committing build ($BUILD_DIR)…"
git add -f "$BUILD_DIR"
git commit -m "$MSG" || echo "ℹ️  Nothing to commit (build unchanged)."

echo "➡️  Pushing $BUILD_DIR to $TARGET_BRANCH…"
# If gh-pages exists already, a normal subtree push is fine.
if git ls-remote --exit-code --heads origin "$TARGET_BRANCH" >/dev/null 2>&1; then
  git subtree push --prefix "$BUILD_DIR" origin "$TARGET_BRANCH"
else
  # First-time publish: split the subtree and force-push to create the branch.
  git push origin "$(git subtree split --prefix "$BUILD_DIR" "$DEFAULT_BRANCH")":"$TARGET_BRANCH" --force
fi

echo "✅ Deployed to branch '$TARGET_BRANCH'."
echo "   Make sure GitHub Pages is set to serve from: $TARGET_BRANCH"