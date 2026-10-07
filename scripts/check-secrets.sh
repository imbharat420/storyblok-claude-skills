#!/usr/bin/env bash
# Fails if any token-like literal exists in docs/, .claude/, prompts/, memory.md or templates/.
set -euo pipefail
PATTERNS='(sk-[A-Za-z0-9]{20,}|[A-Za-z0-9_-]{20,}--[0-9]{6,}--[A-Za-z0-9_-]{10,}|ACCESS_TOKEN\s*=\s*[A-Za-z0-9]{16,}|PAT:\s*\S{20,}|Bearer [A-Za-z0-9._-]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,})'
TARGETS=(docs .claude prompts templates memory.md)
found=0
for t in "${TARGETS[@]}"; do
  [ -e "$t" ] || continue
  if grep -rInE "$PATTERNS" "$t" 2>/dev/null; then found=1; fi
done
if [ $found -eq 1 ]; then echo "FAIL: token-like literals found. Rotate and remove before continuing."; exit 1; fi
echo "OK: no token-like literals in ${TARGETS[*]}"
