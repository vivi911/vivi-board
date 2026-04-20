#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="gen-lang-client-0000195777"
REGION="asia-east1"
SERVICE_NAME="board-ai-summary"

# 讀 API Key
ANTHROPIC_API_KEY=$(gcloud secrets versions access latest --secret=tina-anthropic-api-key --project="$PROJECT_ID")
BOARD_API_KEY="${BOARD_API_KEY:-vivi-board-summary-2026}"

echo "=== Building & Deploying to Cloud Run: ${SERVICE_NAME} ==="

cd "$(dirname "$0")"

gcloud run deploy "$SERVICE_NAME" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --source=. \
  --allow-unauthenticated \
  --memory=256Mi \
  --timeout=120 \
  --max-instances=3 \
  --set-env-vars="ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY},BOARD_API_KEY=${BOARD_API_KEY}"

echo ""
echo "=== Deploy complete ==="
gcloud run services describe "$SERVICE_NAME" --project="$PROJECT_ID" --region="$REGION" --format='value(status.url)'
