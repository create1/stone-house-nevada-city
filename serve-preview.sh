#!/bin/bash
# Local static preview for Stone House site
cd "$(dirname "$0")"
PORT="${1:-8765}"
pkill -f "ruby -run -e httpd .* -p ${PORT}" 2>/dev/null || true
echo "Serving $(pwd) at http://127.0.0.1:${PORT}/"
exec /usr/bin/ruby -run -e httpd . -p "$PORT" -b 127.0.0.1
