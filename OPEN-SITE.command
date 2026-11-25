#!/bin/bash
cd "$(dirname "$0")"
PORT=8765
echo "========================================"
echo "  Stone House local preview"
echo "========================================"
echo "Starting on http://127.0.0.1:$PORT/"
echo "Keep this window OPEN while browsing."
echo "Press Control+C to stop."
echo ""
if command -v lsof >/dev/null 2>&1; then
  lsof -tiTCP:$PORT -sTCP:LISTEN 2>/dev/null | xargs kill 2>/dev/null
fi
(
  sleep 1
  open "http://127.0.0.1:$PORT/"
) &
exec /usr/bin/ruby -run -e httpd . -p "$PORT" -b 127.0.0.1
