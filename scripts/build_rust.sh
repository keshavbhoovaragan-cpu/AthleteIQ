#!/bin/bash
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "⚙  Building Rust fantasy engine..."
cd "$ROOT/rust-engine" && cargo build --release
echo "✅ Binary: $ROOT/rust-engine/target/release/fantasy-engine"
"$ROOT/rust-engine/target/release/fantasy-engine" --benchmark
