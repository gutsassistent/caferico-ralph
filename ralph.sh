#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop (Codex edition)
# Usage: ./ralph.sh [max_iterations]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

MAX_ITERATIONS=${1:-200}
iteration=0

echo "Starting agent loop..."

while true; do
  iteration=$((iteration + 1))

  if [ "$iteration" -gt "$MAX_ITERATIONS" ]; then
    echo "Max iterations ($MAX_ITERATIONS) reached. Stopping."
    break
  fi

  # Check status file for stop condition
  if [ -f "$SCRIPT_DIR/status.md" ]; then
    STATUS=$(grep -o 'Status: [a-zA-Z]*' "$SCRIPT_DIR/status.md" | cut -d' ' -f2)

    if [ "$STATUS" = "done" ] || [ "$STATUS" = "blocked" ]; then
      echo "Agent stopped with status: $STATUS"
      cat "$SCRIPT_DIR/status.md"
      break
    fi
  fi

  echo ""
  echo "=== Running iteration $iteration/$MAX_ITERATIONS at $(date) ==="
  echo "Current status: ${STATUS:-running}"
  echo ""

  # Run Codex with the prompt from CLAUDE.md, working directory set to script dir
  codex exec \
    -m gpt-5.2-codex \
    -C "$SCRIPT_DIR" \
    -c model_reasoning_effort='"xhigh"' \
    --dangerously-bypass-approvals-and-sandbox \
    "$(cat "$SCRIPT_DIR/CLAUDE.md")" \
    || true

  # Small delay to avoid hammering the API
  sleep 2
done

echo ""
echo "Loop completed!"
