#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="gen-lang-client-0000195777"
REGION="asia-east1"
FUNCTION_NAME="board-ai-summary"
ENTRY_POINT="board_ai_summary"
RUNTIME="python312"

# Read ANTHROPIC_API_KEY from .env if it exists, otherwise use placeholder
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/../.env" ]; then
    ANTHROPIC_API_KEY=$(grep -E '^ANTHROPIC_API_KEY=' "$SCRIPT_DIR/../.env" | cut -d'=' -f2- | tr -d '"' | tr -d "'" || true)
fi
ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-YOUR_ANTHROPIC_API_KEY_HERE}"

BOARD_API_KEY="${BOARD_API_KEY:-vivi-board-summary-2026}"

echo "=== Deploying Cloud Function: ${FUNCTION_NAME} ==="
echo "Project:  ${PROJECT_ID}"
echo "Region:   ${REGION}"
echo "Runtime:  ${RUNTIME}"
echo ""

gcloud functions deploy "${FUNCTION_NAME}" \
    --project="${PROJECT_ID}" \
    --region="${REGION}" \
    --runtime="${RUNTIME}" \
    --trigger-http \
    --allow-unauthenticated \
    --entry-point="${ENTRY_POINT}" \
    --source="${SCRIPT_DIR}" \
    --memory=256MB \
    --timeout=120s \
    --set-env-vars="ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY},BOARD_API_KEY=${BOARD_API_KEY}"

echo ""
echo "=== Deploy complete ==="
echo "URL: https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}"
