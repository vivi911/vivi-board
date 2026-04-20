import os
import json
import functions_framework
from anthropic import Anthropic

ALLOWED_ORIGIN = "https://board.goaskvivi.com"
BOARD_API_KEY = os.environ.get("BOARD_API_KEY", "")

SYSTEM_PROMPT = "你是會議記錄助理。請用繁體中文回覆。"

USER_PROMPT_TEMPLATE = """你是會議記錄助理。請根據以下會議逐字稿，整理成：

## 重點摘要
- 條列式重點

## 需求與痛點
- 對方提到的具體需求和痛點

## 決策與共識
- 會議中達成的決策

## 行動計畫
- 下一步要做的事，標明負責人（如有提到）

逐字稿：
{transcript}"""


def _cors_headers():
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
        "Access-Control-Max-Age": "3600",
    }


def _error(message, status_code):
    return (
        json.dumps({"error": message}, ensure_ascii=False),
        status_code,
        {**_cors_headers(), "Content-Type": "application/json"},
    )


@functions_framework.http
def board_ai_summary(request):
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return ("", 204, _cors_headers())

    # Only allow POST
    if request.method != "POST":
        return _error("Method not allowed", 405)

    # Validate API key
    api_key = request.headers.get("X-API-Key", "")
    if not api_key or api_key != BOARD_API_KEY:
        return _error("Unauthorized", 401)

    # Parse request body
    try:
        body = request.get_json(force=True)
    except Exception:
        return _error("Invalid JSON body", 400)

    if not body or "transcript" not in body:
        return _error("Missing 'transcript' field", 400)

    transcript = body["transcript"].strip()
    if not transcript:
        return _error("Transcript is empty", 400)

    # Limit transcript length (roughly 100k chars ~ 50k tokens)
    if len(transcript) > 100000:
        return _error("Transcript too long (max 100,000 characters)", 400)

    # Call Anthropic Claude API
    try:
        client = Anthropic()  # uses ANTHROPIC_API_KEY env var
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": USER_PROMPT_TEMPLATE.format(transcript=transcript),
                }
            ],
        )
        summary = message.content[0].text
    except Exception as e:
        return _error(f"AI summarization failed: {str(e)}", 500)

    return (
        json.dumps({"summary": summary}, ensure_ascii=False),
        200,
        {**_cors_headers(), "Content-Type": "application/json"},
    )
