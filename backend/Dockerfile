FROM rust:1.75-slim as rust-builder
WORKDIR /rust
COPY rust-engine/Cargo.toml ./
COPY rust-engine/src ./src
RUN cargo build --release

FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc curl && rm -rf /var/lib/apt/lists/*
COPY --from=rust-builder /rust/target/release/fantasy-engine /usr/local/bin/fantasy-engine
RUN chmod +x /usr/local/bin/fantasy-engine
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
ENV RUST_BINARY=/usr/local/bin/fantasy-engine
ENV PORT=8000
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
