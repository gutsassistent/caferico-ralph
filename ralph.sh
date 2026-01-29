#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop (Codex edition)
# Usage: ./ralph.sh [max_iterations]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

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
  if [ -f "./status.md" ]; then
    STATUS=$(grep -o 'Status: [a-zA-Z]*' ./status.md | cut -d' ' -f2)

    if [ "$STATUS" = "done" ] || [ "$STATUS" = "blocked" ]; then
      echo "Agent stopped with status: $STATUS"
      cat ./status.md
      break
    fi
  fi

  echo ""
  echo "=== Running iteration $iteration/$MAX_ITERATIONS at $(date) ==="
  echo "Current status: ${STATUS:-unknown}"
  echo ""

  # Run Codex with the prompt file, explicitly setting working directory
  prompt="Working directory: $SCRIPT_DIR

$(cat ./CLAUDE.md)

IMPORTANT: All files (prd.json, progress.txt, CLAUDE.md) are in $SCRIPT_DIR. The Next.js project will also be created here. Read prd.json from this directory to find user stories."
  codex exec "$prompt" --model gpt-5.2-codex --full-auto --config model_reasoning_effort="xhigh"

  # Small delay to avoid hammering the API
  sleep 2
done

echo ""
echo "Loop completed!"
