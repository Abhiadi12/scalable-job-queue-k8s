#!/usr/bin/env bash
set -euo pipefail

URL="${1:-http://127.0.0.1/submit}"
REQUESTS="${REQUESTS:-5000}"
CONCURRENCY="${CONCURRENCY:-200}"
BODY="${BODY:-$(dirname "$0")/submit-primes.json}"

ab -r -n "$REQUESTS" -c "$CONCURRENCY" -p "$BODY" -T application/json "$URL"
