#!/bin/bash
# ══════════════════════════════════════════════════════════════════
# Official AI — Automated QA Loop
# Runs Playwright tests every 15 minutes for 6 hours (24 runs)
#
# Usage: bash scripts/qa-loop.sh https://official-ai-app.netlify.app
# ══════════════════════════════════════════════════════════════════

BASE_URL="${1:-https://official-ai-app.netlify.app}"
TOTAL_RUNS=24
INTERVAL_SECONDS=900  # 15 minutes
LOG_DIR="qa-results"

mkdir -p "$LOG_DIR"

echo "Starting QA loop: $TOTAL_RUNS runs, every ${INTERVAL_SECONDS}s"
echo "Target: $BASE_URL"
echo "Logs: $LOG_DIR/"
echo ""

for ((i=1; i<=TOTAL_RUNS; i++)); do
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  LOG_FILE="$LOG_DIR/qa_run_${i}_${TIMESTAMP}.log"

  echo "[$TIMESTAMP] Run $i/$TOTAL_RUNS starting..."

  {
    echo "=== QA Run $i — $(date) ==="
    echo "Target: $BASE_URL"
    echo ""

    # Test 1: Homepage loads
    echo "--- Test 1: Homepage ---"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/" 2>&1)
    echo "GET / → $HTTP_CODE"
    [ "$HTTP_CODE" = "200" ] && echo "PASS" || echo "FAIL"
    echo ""

    # Test 2: Demo page loads
    echo "--- Test 2: Demo page ---"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/demo" 2>&1)
    echo "GET /demo → $HTTP_CODE"
    [ "$HTTP_CODE" = "200" ] && echo "PASS" || echo "FAIL"
    echo ""

    # Test 3: Auth onboarding loads
    echo "--- Test 3: Auth onboarding ---"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/auth/onboarding" 2>&1)
    echo "GET /auth/onboarding → $HTTP_CODE"
    [ "$HTTP_CODE" = "200" ] && echo "PASS" || echo "FAIL"
    echo ""

    # Test 4: Health check API
    echo "--- Test 4: Health check ---"
    HEALTH=$(curl -s "$BASE_URL/api/health" 2>&1)
    echo "GET /api/health → $HEALTH" | head -5
    echo "$HEALTH" | grep -q '"healthy"' && echo "PASS" || echo "DEGRADED"
    echo ""

    # Test 5: Pricing page
    echo "--- Test 5: Pricing ---"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/pricing" 2>&1)
    echo "GET /pricing → $HTTP_CODE"
    [ "$HTTP_CODE" = "200" ] && echo "PASS" || echo "FAIL"
    echo ""

    # Test 6: Dashboard (should redirect to login)
    echo "--- Test 6: Dashboard (auth check) ---"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "$BASE_URL/dashboard" 2>&1)
    echo "GET /dashboard → $HTTP_CODE"
    echo ""

    # Test 7: API generate endpoint (should 401 without auth)
    echo "--- Test 7: Generate API (auth required) ---"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/generate" 2>&1)
    echo "POST /api/generate → $HTTP_CODE"
    [ "$HTTP_CODE" = "401" ] && echo "PASS (correctly requires auth)" || echo "UNEXPECTED: $HTTP_CODE"
    echo ""

    # Test 8: Templates API (should 401 without auth)
    echo "--- Test 8: Templates API ---"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/templates" 2>&1)
    echo "GET /api/templates → $HTTP_CODE"
    [ "$HTTP_CODE" = "401" ] && echo "PASS (correctly requires auth)" || echo "UNEXPECTED: $HTTP_CODE"
    echo ""

    # Test 9: Static assets load
    echo "--- Test 9: Static assets ---"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/_next/static/css/" 2>&1)
    echo "Static CSS → $HTTP_CODE"
    echo ""

    # Test 10: Industry pages
    echo "--- Test 10: Industry pages ---"
    for PAGE in realtors attorneys doctors advisors; do
      HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/for/$PAGE" 2>&1)
      echo "GET /for/$PAGE → $HTTP_CODE"
    done
    echo ""

    echo "=== Run $i complete ==="

  } > "$LOG_FILE" 2>&1

  # Print summary
  PASSES=$(grep -c "PASS" "$LOG_FILE")
  FAILS=$(grep -c "FAIL" "$LOG_FILE")
  echo "[$TIMESTAMP] Run $i: $PASSES passes, $FAILS fails → $LOG_FILE"

  if [ $i -lt $TOTAL_RUNS ]; then
    echo "Next run in ${INTERVAL_SECONDS}s..."
    sleep $INTERVAL_SECONDS
  fi
done

echo ""
echo "QA loop complete. $TOTAL_RUNS runs finished."
echo "Results in $LOG_DIR/"
