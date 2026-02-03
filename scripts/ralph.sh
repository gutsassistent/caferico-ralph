#!/bin/bash
# Ralph v2 — Iterative AI Build Loop
# Each iteration spawns a FRESH agent session (clean context).
# Usage: ./scripts/ralph.sh [options]
#
# Options:
#   --tool claude|codex|amp|opencode    Agent CLI to use (default: claude)
#   --model <model>            Model override (e.g. claude-sonnet-4-5)
#   --max <N>                  Max iterations (default: 50)
#   --step <N>                 Lower bound: ignore steps < N
#   --range <A-B>               Restrict agent to a step range (inclusive)
#   --steps <A,B,C>             Restrict agent to an explicit step list
#   --dry-run                  Show what would run, don't execute

set -e

# --- Config ---
TOOL="claude"
MODEL=""
MAX_ITERATIONS=50
START_STEP=""
SCOPE_RANGE=""
SCOPE_STEPS=""
DRY_RUN=false
RALPH_DIR="ralph"
PROGRESS_FILE="$RALPH_DIR/progress.md"
LESSONS_FILE="$RALPH_DIR/lessons.md"
FAILURES_FILE="$RALPH_DIR/failures.log"

# --- Opencode model normalization ---
# Opencode expects models in provider/model format.
normalize_opencode_model() {
  local input="$1"

  # Default for this repo's Ralph loop.
  if [ -z "$input" ]; then
    echo "opencode/kimi-k2.5-free"
    return 0
  fi

  # Accept a few common display-name variants.
  case "$input" in
    "Kimi K2.5 Free OpenCode Zen"|"Kimi K2.5 Free"|"Kimi K2.5")
      echo "opencode/kimi-k2.5-free"
      return 0
      ;;
  esac

  echo "$input"
}

# --- Parse args ---
while [[ $# -gt 0 ]]; do
  case $1 in
    --tool)    TOOL="$2"; shift 2 ;;
    --tool=*)  TOOL="${1#*=}"; shift ;;
    --model)   MODEL="$2"; shift 2 ;;
    --model=*) MODEL="${1#*=}"; shift ;;
    --max)     MAX_ITERATIONS="$2"; shift 2 ;;
    --max=*)   MAX_ITERATIONS="${1#*=}"; shift ;;
    --step)    START_STEP="$2"; shift 2 ;;
    --step=*)  START_STEP="${1#*=}"; shift ;;
    --range)   SCOPE_RANGE="$2"; shift 2 ;;
    --range=*) SCOPE_RANGE="${1#*=}"; shift ;;
    --steps)   SCOPE_STEPS="$2"; shift 2 ;;
    --steps=*) SCOPE_STEPS="${1#*=}"; shift ;;
    --dry-run) DRY_RUN=true; shift ;;
    *)         echo "Unknown option: $1"; exit 1 ;;
  esac
done

# --- Tool-specific defaults / normalization ---
if [ "$TOOL" = "opencode" ]; then
  MODEL="$(normalize_opencode_model "$MODEL")"
fi

# --- Scope parsing / validation ---
SCOPE_MODE=""
SCOPE_MIN=""
SCOPE_MAX=""
SCOPE_DESC=""

if [ -n "$SCOPE_RANGE" ] && [ -n "$SCOPE_STEPS" ]; then
  echo "Error: Use only one of --range or --steps"
  exit 1
fi

if [ -n "$SCOPE_RANGE" ]; then
  if [[ ! "$SCOPE_RANGE" =~ ^[0-9]+-[0-9]+$ ]]; then
    echo "Error: --range must be in A-B format (e.g. 16-17)"
    exit 1
  fi
  SCOPE_MODE="range"
  SCOPE_MIN="${SCOPE_RANGE%-*}"
  SCOPE_MAX="${SCOPE_RANGE#*-}"
  if [ "$SCOPE_MIN" -gt "$SCOPE_MAX" ]; then
    echo "Error: --range min must be <= max"
    exit 1
  fi
  SCOPE_DESC="steps $SCOPE_MIN-$SCOPE_MAX"
fi

if [ -n "$SCOPE_STEPS" ]; then
  if [[ ! "$SCOPE_STEPS" =~ ^[0-9]+(,[0-9]+)*$ ]]; then
    echo "Error: --steps must be a comma-separated list (e.g. 16,17)"
    exit 1
  fi
  SCOPE_MODE="steps"
  SCOPE_DESC="steps {$SCOPE_STEPS}"
fi

if [ -n "$START_STEP" ] && [[ ! "$START_STEP" =~ ^[0-9]+$ ]]; then
  echo "Error: --step must be a number"
  exit 1
fi

# --- Validate ---
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "Error: $PROGRESS_FILE not found. Run scripts/init.sh first."
  exit 1
fi

if [ ! -f "CLAUDE.md" ]; then
  echo "Error: CLAUDE.md not found."
  exit 1
fi

# --- Build prompt ---
build_prompt() {
  local iteration=$1
  cat << 'PROMPT'
You are a worker agent in a Ralph v2 iterative build loop. This is a SINGLE iteration — do ONE step, then stop.
PROMPT

  if [ -n "$SCOPE_MODE" ]; then
    cat << PROMPT

## Scope for this run:
- Allowed: $SCOPE_DESC
- ONLY consider steps in this scope when choosing work.
- Mark DONE / BLOCKED ONLY for steps in this scope.
- Output <signal>COMPLETE</signal> when ALL steps in this scope are DONE (ignore other steps in progress.md).
- Output <signal>BLOCKED</signal> when all remaining steps in this scope are BLOCKED.
PROMPT
  fi

  if [ -n "$START_STEP" ]; then
    cat << PROMPT

## Lower bound:
- Ignore any steps numbered < $START_STEP.
PROMPT
  fi

  cat << 'PROMPT'

## Your task for this iteration:

1. Read `ralph/lessons.md` — learn what to avoid
2. Read `ralph/failures.log` — check for repeated failures (3x same hash = STOP)
3. Read `ralph/progress.md` — find the first NOT STARTED or IN PROGRESS step (within scope if provided)
4. Execute ONLY that one step
5. Verify: run the project's test/build commands
6. Update `ralph/progress.md` with the result (ONLY the checkbox line for your step; do not edit other sections to avoid merge conflicts)
7. If you failed: append to `ralph/failures.log` (format: `iteration:N|action:description|error:message|hash:short`) and add a lesson to `ralph/lessons.md`
8. If you succeeded: mark the step as DONE in `ralph/progress.md`
9. `git add -A && git commit -m "ralph: step N - [description]"`

## Critical rules:
- Do EXACTLY ONE step. Not two. Not "one and a quick fix".
- ONLY work on steps listed in ralph/progress.md. If a step is not in your progress.md, it DOES NOT EXIST for you.
- Do NOT implement, fix, or touch anything outside your assigned steps — even if you think it needs it.
- If the same failure hash appears 3x in failures.log, write STUCK in progress.md and output: <signal>STUCK</signal>
- If ALL steps in your progress.md are DONE (or ALL steps in your scope, if provided), output: <signal>COMPLETE</signal>
- If a step is BLOCKED, skip to the next NOT STARTED step. If all remaining are BLOCKED, output: <signal>BLOCKED</signal>
- Do NOT touch files unrelated to the current step
- Do NOT refactor or clean up unless that IS the current step
- If the plan needs changing, update the plan FIRST, commit it separately, THEN proceed

PROMPT
  echo ""
  echo "Current iteration: $iteration"
}

# --- Tool command ---
run_agent() {
  local iteration=$1
  local prompt
  prompt=$(build_prompt "$iteration")

  case "$TOOL" in
    claude)
      local model_flag=""
      if [ -n "$MODEL" ]; then
        model_flag="--model $MODEL"
      fi
      echo "$prompt" | claude --dangerously-skip-permissions $model_flag --print 2>&1
      ;;
    codex)
      local model_flag=""
      if [ -n "$MODEL" ]; then
        model_flag="-m $MODEL"
      fi
      codex exec --dangerously-bypass-approvals-and-sandbox $model_flag "$prompt" 2>&1
      ;;
    amp)
      echo "$prompt" | amp --dangerously-allow-all 2>&1
      ;;
    opencode)
      # Opencode needs the model in provider/model format (e.g. opencode/kimi-k2.5-free)
      # and runs best with the permissive build agent for repo automation.
      opencode run --format default --agent build -m "$MODEL" "$prompt" 2>&1
      ;;
    *)
      echo "Error: Unknown tool '$TOOL'"
      exit 1
      ;;
  esac
}

# --- Loop detection ---
check_stuck() {
  if [ ! -f "$FAILURES_FILE" ] || [ ! -s "$FAILURES_FILE" ]; then
    return 1
  fi
  
  # Extract hashes, find any that appear 3+ times
  local stuck_hash
  stuck_hash=$(grep -oP 'hash:\K\S+' "$FAILURES_FILE" 2>/dev/null | sort | uniq -c | sort -rn | head -1)
  
  if [ -n "$stuck_hash" ]; then
    local count
    count=$(echo "$stuck_hash" | awk '{print $1}')
    if [ "$count" -ge 3 ]; then
      return 0  # stuck
    fi
  fi
  return 1  # not stuck
}

# --- Progress check ---
count_progress() {
  # Outputs: "<done> <total>".
  if [ -z "$SCOPE_MODE" ] && [ -z "$START_STEP" ]; then
    local done total
    done=$(grep -c '\[x\]' "$PROGRESS_FILE" 2>/dev/null || echo 0)
    total=$(grep -cE '\[[ x]\]' "$PROGRESS_FILE" 2>/dev/null || echo 0)
    echo "$done $total"
    return 0
  fi

  awk \
    -v mode="$SCOPE_MODE" \
    -v min="$SCOPE_MIN" \
    -v max="$SCOPE_MAX" \
    -v list="$SCOPE_STEPS" \
    -v start="$START_STEP" \
    '
      BEGIN {
        done=0; total=0;
        if (mode == "steps") {
          n=split(list, a, /,/);
          for (i=1; i<=n; i++) allowed[a[i]] = 1;
        }
      }
      {
        if (match($0, /- *\[[ x]\] *[0-9]+\./)) {
          tmp = $0;
          sub(/.*\[[ x]\] */, "", tmp);
          sub(/\..*/, "", tmp);
          step = tmp + 0;
          ok = 1;

          if (start != "") {
            ok = ok && (step >= (start + 0));
          }

          if (mode == "range") {
            ok = ok && (step >= (min + 0) && step <= (max + 0));
          } else if (mode == "steps") {
            ok = ok && (allowed[step] == 1);
          }

          if (ok) {
            total++;
            if ($0 ~ /\[x\]/) done++;
          }
        }
      }
      END { print done, total }
    ' "$PROGRESS_FILE" 2>/dev/null || echo "0 0"
}

count_done() {
  count_progress | awk '{print $1}'
}

count_total() {
  count_progress | awk '{print $2}'
}

# --- Main loop ---
echo "╔══════════════════════════════════════════════════╗"
echo "║  Ralph v2 — Iterative Build Loop                ║"
echo "║  Tool: $TOOL $([ -n "$MODEL" ] && echo "($MODEL)" || echo "")                        "
echo "║  Max iterations: $MAX_ITERATIONS                         "
echo "╚══════════════════════════════════════════════════╝"
echo ""

if $DRY_RUN; then
  echo "[DRY RUN] Would run $MAX_ITERATIONS iterations with $TOOL"
  echo "[DRY RUN] Prompt preview:"
  build_prompt 1
  exit 0
fi

STALL_COUNT=0
LAST_DONE_COUNT=$(count_done)

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "┌──────────────────────────────────────────────────┐"
  echo "│  Iteration $i/$MAX_ITERATIONS — $(count_done)/$(count_total) steps done"
  echo "└──────────────────────────────────────────────────┘"
  
  # Pre-flight: check if stuck
  if check_stuck; then
    echo "🛑 STUCK detected in failures.log — stopping loop."
    echo "   Check ralph/failures.log and ralph/progress.md for details."
    exit 2
  fi
  
  # Run agent
  OUTPUT=$(run_agent "$i" | tee /dev/stderr) || true
  
  # Check signals
  if echo "$OUTPUT" | grep -q "<signal>COMPLETE</signal>"; then
    echo ""
    echo "✅ All steps complete! Finished at iteration $i."
    exit 0
  fi
  
  if echo "$OUTPUT" | grep -q "<signal>STUCK</signal>"; then
    echo ""
    echo "🛑 Agent reported STUCK at iteration $i."
    echo "   Check ralph/failures.log for repeated failures."
    exit 2
  fi
  
  if echo "$OUTPUT" | grep -q "<signal>BLOCKED</signal>"; then
    echo ""
    echo "⚠️  All remaining steps are BLOCKED at iteration $i."
    echo "   Check ralph/progress.md for blocked reasons."
    exit 3
  fi
  
  # Progress stall detection
  CURRENT_DONE=$(count_done)
  if [ "$CURRENT_DONE" -eq "$LAST_DONE_COUNT" ]; then
    STALL_COUNT=$((STALL_COUNT + 1))
    if [ "$STALL_COUNT" -ge 5 ]; then
      echo ""
      echo "⚠️  No progress in 5 iterations — possible stall."
      echo "   Consider reviewing ralph/progress.md and ralph/failures.log."
      # Don't exit — maybe the agent is working on a multi-iteration step
      STALL_COUNT=0  # Reset to give another 5
    fi
  else
    STALL_COUNT=0
    LAST_DONE_COUNT=$CURRENT_DONE
  fi
  
  echo ""
  echo "   Progress: $(count_done)/$(count_total) steps done"
  
  # Brief pause between iterations
  sleep 2
done

echo ""
echo "⏰ Reached max iterations ($MAX_ITERATIONS) without completing all steps."
echo "   Progress: $(count_done)/$(count_total) steps done"
echo "   Check ralph/progress.md for current state."
exit 1
