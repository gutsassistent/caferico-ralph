#!/usr/bin/env bash
# Parallel Ralph Orchestrator (worktrees)
#
# Runs multiple scoped Ralph loops in parallel using git worktrees.
# Designed for Phase C (steps 16–21) Wave 2, but generic enough to tweak.

set -euo pipefail

TOOL="claude"
MODEL="opus"
BASE_BRANCH="main"
REMOTE="origin"
MAX_ITERATIONS=50
WORKTREES_DIR=".worktrees/ralph-phase-c-wave2"
RETRIES=1
RETRY_STUCK=false
DRY_RUN=false
REUSE_WORKTREES=false
DRAFT_PR=true
ALLOW_DIRTY=false

# PID carrier to avoid command-substitution subshell issues.
AGENT_PID=""

usage() {
  cat <<'EOF'
Usage: ./scripts/parallel-ralph.sh [options]

Options:
  --tool <tool>            claude|codex|amp|opencode (default: claude)
  --model <model>          Model for tool (default: opus)
  --base <branch>          Base branch for worktrees/PRs (default: main)
  --remote <name>          Git remote for pushing (default: origin)
  --max <N>                Max iterations per agent (default: 50)
  --worktrees-dir <path>   Where to create worktrees (default: .worktrees/ralph-phase-c-wave2)
  --retries <N>            Retry failed agents N times after initial wave (default: 1)
  --retry-stuck            Also retry agents that exit with STUCK (default: false)
  --reuse                  Reuse existing worktrees/branches if present
  --no-draft               Create PRs as ready (default: draft)
  --allow-dirty             Allow running with a dirty working tree (not recommended)
  --dry-run                Print what would run
  -h, --help               Show help

Notes:
  - Requires: git
  - For PR creation: gh (GitHub CLI) + auth
  - Requires scripts/ralph.sh supports scoping via --range/--steps.
EOF
}

log() {
  printf '%s\n' "$*"
}

die() {
  printf '%s\n' "$*" >&2
  exit 1
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing command: $1"
}

run() {
  if $DRY_RUN; then
    printf '[DRY RUN]'
    printf ' %q' "$@"
    printf '\n'
    return 0
  fi
  "$@"
}

# --- Parse args ---
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tool) TOOL="$2"; shift 2 ;;
    --tool=*) TOOL="${1#*=}"; shift ;;
    --model) MODEL="$2"; shift 2 ;;
    --model=*) MODEL="${1#*=}"; shift ;;
    --base) BASE_BRANCH="$2"; shift 2 ;;
    --base=*) BASE_BRANCH="${1#*=}"; shift ;;
    --remote) REMOTE="$2"; shift 2 ;;
    --remote=*) REMOTE="${1#*=}"; shift ;;
    --max) MAX_ITERATIONS="$2"; shift 2 ;;
    --max=*) MAX_ITERATIONS="${1#*=}"; shift ;;
    --worktrees-dir) WORKTREES_DIR="$2"; shift 2 ;;
    --worktrees-dir=*) WORKTREES_DIR="${1#*=}"; shift ;;
    --retries) RETRIES="$2"; shift 2 ;;
    --retries=*) RETRIES="${1#*=}"; shift ;;
    --retry-stuck) RETRY_STUCK=true; shift ;;
    --reuse) REUSE_WORKTREES=true; shift ;;
    --no-draft) DRAFT_PR=false; shift ;;
    --allow-dirty) ALLOW_DIRTY=true; shift ;;
    --dry-run) DRY_RUN=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) die "Unknown option: $1" ;;
  esac
done

need_cmd git

ROOT=$(git rev-parse --show-toplevel)
if [ -z "$ROOT" ]; then
  die "Not in a git repository"
fi

cd "$ROOT"

if [ ! -x "./scripts/ralph.sh" ]; then
  die "Missing or non-executable: ./scripts/ralph.sh"
fi

if [ ! -f "./ralph/progress.md" ]; then
  die "Missing: ./ralph/progress.md"
fi

if ! $ALLOW_DIRTY && [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  die "Working tree is dirty. Commit/stash first so worktrees include the right state (or pass --allow-dirty)."
fi

LOG_DIR="$WORKTREES_DIR/logs"

run mkdir -p "$WORKTREES_DIR"
run mkdir -p "$LOG_DIR"

MAIN_NODE_MODULES="$ROOT/node_modules"
MAIN_ENV_LOCAL="$ROOT/.env.local"

maybe_link_shared_files() {
  local wt_path="$1"

  if [ -d "$MAIN_NODE_MODULES" ] && [ ! -e "$wt_path/node_modules" ]; then
    run ln -s "$MAIN_NODE_MODULES" "$wt_path/node_modules"
  fi

  if [ -f "$MAIN_ENV_LOCAL" ] && [ ! -e "$wt_path/.env.local" ]; then
    run ln -s "$MAIN_ENV_LOCAL" "$wt_path/.env.local"
  fi
}

ensure_worktree() {
  local name="$1"
  local branch="$2"
  local path="$3"

  if [ -d "$path" ]; then
    if ! $REUSE_WORKTREES; then
      die "Worktree path exists: $path (use --reuse or remove it)"
    fi
    log "Reusing worktree: $name -> $path"
    return 0
  fi

  # If branch exists, attach it; otherwise create from base.
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    run git worktree add "$path" "$branch"
  else
    run git worktree add -b "$branch" "$path" "$BASE_BRANCH"
  fi

  maybe_link_shared_files "$path"
}

start_agent_loop() {
  local name="$1"
  local branch="$2"
  local path="$3"
  local range="$4"

  local log_file="$LOG_DIR/$name.log"
  local cmd
  cmd="(cd \"$path\" && ./scripts/ralph.sh --tool \"$TOOL\" --model \"$MODEL\" --max \"$MAX_ITERATIONS\" --range \"$range\")"

  AGENT_PID=""

  if $DRY_RUN; then
    log "[DRY RUN] $cmd > \"$log_file\" 2>&1 &" >&2
    return 0
  fi

  log "Starting $name ($range) in $path" >&2
  bash -lc "$cmd" >"$log_file" 2>&1 &
  AGENT_PID=$!
}

push_and_pr() {
  local name="$1"
  local branch="$2"
  local path="$3"
  local range="$4"

  log "Pushing branch for $name: $branch"
  run git -C "$path" push -u "$REMOTE" "$branch"

  if ! command -v gh >/dev/null 2>&1; then
    log "Skipping PR creation for $name (gh not installed)."
    return 0
  fi

  local title="ralph: phase C - ${name} (${range})"
  local body
  body=$(cat <<EOF
## Scope
- Wave: Phase C (Wave 2)
- Agent: ${name}
- Steps: ${range}

## Notes
- This PR was produced by a scoped Ralph loop in a dedicated git worktree.
EOF
)

  local -a draft_args
  draft_args=()
  if $DRAFT_PR; then
    draft_args+=(--draft)
  fi

  log "Creating PR for $name (base: $BASE_BRANCH)"
  if $DRY_RUN; then
    log "[DRY RUN] (cd \"$path\" && gh pr create --base \"$BASE_BRANCH\" --head \"$branch\" --title \"$title\" --body <multiline> ${draft_args[*]})"
  else
    (cd "$path" && gh pr create --base "$BASE_BRANCH" --head "$branch" --title "$title" --body "$body" "${draft_args[@]}")
  fi
}

# --- Agent manifest (Phase C, Wave 2) ---
# Blog: steps 16–17 (blog listing + detail)
# About: steps 18–19 (same file)
# Subscriptions: step 20 (note: typically touches SubscriptionTierCard + SubscriptionFaq)
# Locations: step 21 (page + LocationsGrid)

AGENTS=("blog" "about" "subscriptions" "locations")

agent_branch() {
  case "$1" in
    blog) echo "ralph/phase-c-blog-16-17" ;;
    about) echo "ralph/phase-c-about-18-19" ;;
    subscriptions) echo "ralph/phase-c-subscriptions-20" ;;
    locations) echo "ralph/phase-c-locations-21" ;;
    *) die "Unknown agent: $1" ;;
  esac
}

agent_range() {
  case "$1" in
    blog) echo "16-17" ;;
    about) echo "18-19" ;;
    subscriptions) echo "20-20" ;;
    locations) echo "21-21" ;;
    *) die "Unknown agent: $1" ;;
  esac
}

agent_path() {
  echo "$WORKTREES_DIR/$1"
}

log "Preparing worktrees under: $WORKTREES_DIR"
log "Base: $BASE_BRANCH | Tool: $TOOL ($MODEL) | Max iterations: $MAX_ITERATIONS"

# Ensure base branch exists locally.
if ! git show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
  log "Base branch '$BASE_BRANCH' not found locally; attempting fetch from $REMOTE"
  run git fetch "$REMOTE" "$BASE_BRANCH:$BASE_BRANCH"
fi

for name in "${AGENTS[@]}"; do
  branch=$(agent_branch "$name")
  path=$(agent_path "$name")
  ensure_worktree "$name" "$branch" "$path"
done

if [ ! -d "$MAIN_NODE_MODULES" ]; then
  log "Warning: $MAIN_NODE_MODULES missing. Each agent may fail on npm commands."
  log "         Run 'npm ci' in the repo root, then re-run."
fi

declare -A LAST_STATUS

attempt=0
remaining=("${AGENTS[@]}")

while [ ${#remaining[@]} -gt 0 ] && [ "$attempt" -le "$RETRIES" ]; do
  attempt=$((attempt + 1))
  log ""
  log "=== Wave attempt $attempt (agents: ${remaining[*]}) ==="

  declare -A PIDS

  for name in "${remaining[@]}"; do
    branch=$(agent_branch "$name")
    path=$(agent_path "$name")
    range=$(agent_range "$name")

    start_agent_loop "$name" "$branch" "$path" "$range" || true
    if ! $DRY_RUN; then
      PIDS["$name"]="$AGENT_PID"
      # Stagger starts slightly to avoid thundering herd on tool auth/rate limits.
      sleep 1
    fi
  done

  if $DRY_RUN; then
    log "[DRY RUN] Not waiting for agents."
    exit 0
  fi

  next_remaining=()

  for name in "${remaining[@]}"; do
    pid="${PIDS[$name]}"
    log "Waiting for $name (pid $pid)"
    set +e
    wait "$pid"
    status=$?
    set -e
    LAST_STATUS["$name"]="$status"

    branch=$(agent_branch "$name")
    path=$(agent_path "$name")
    range=$(agent_range "$name")

    if [ "$status" -eq 0 ]; then
      log "$name completed successfully."
      push_and_pr "$name" "$branch" "$path" "$range" || true
    else
      log "$name failed with exit code $status (log: $LOG_DIR/$name.log)"
      if [ "$status" -eq 2 ] && ! $RETRY_STUCK; then
        log "$name reported STUCK; not retrying (use --retry-stuck to force)."
      else
        next_remaining+=("$name")
      fi
    fi
  done

  remaining=("${next_remaining[@]}")
done

log ""
log "=== Final status ==="
for name in "${AGENTS[@]}"; do
  status="${LAST_STATUS[$name]:-N/A}"
  log "- $name: $status (0=ok) | log: $LOG_DIR/$name.log"
done

if [ ${#remaining[@]} -gt 0 ]; then
  die "Some agents did not complete after retries: ${remaining[*]}"
fi

log "All agents finished."
