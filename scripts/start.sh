#!/bin/bash
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV="$ROOT/backend/venv/bin"
echo "🏀 AthleteIQ starting..."
if [ ! -f "$ROOT/rust-engine/target/release/fantasy-engine" ]; then
  echo "⚙  Compiling Rust engine..."
  cd "$ROOT/rust-engine" && cargo build --release 2>&1
  echo "✅ Rust engine compiled"
fi
echo "▶  Starting FastAPI on :8000"
cd "$ROOT/backend" && "$VENV/uvicorn" app.main:app --reload --port 8000 &
BACKEND_PID=$!
echo "▶  Starting Next.js on :3000"
cd "$ROOT/frontend" && npm run dev &
FRONTEND_PID=$!
echo "✅ AthleteIQ running"
echo "   Frontend → http://localhost:3000"
echo "   Backend  → http://localhost:8000/docs"
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'; exit 0" SIGINT SIGTERM
wait
