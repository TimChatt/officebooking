# ---------- PHASE 1: Build ----------
FROM node:20 AS builder
WORKDIR /app

# Install Python & pip (for forecast module)
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Setup Python virtual environment
RUN python3 -m venv /venv
ENV PATH="/venv/bin:${PATH}"

# Copy everything needed for monorepo
COPY . .

# Install Node.js dependencies
RUN npm install --legacy-peer-deps --no-audit --prefer-online

# Build the frontend (this triggers Vite and Tailwind)
RUN npm --workspace packages/web run build

# Install Python dependencies
RUN pip install --no-cache-dir -r packages/forecast/requirements.txt

# ---------- PHASE 2: Runtime ----------
FROM node:20-slim AS runner
WORKDIR /app

# Install Python runtime to support virtualenv
RUN apt-get update && \
    apt-get install -y python3 python3-venv && \
    rm -rf /var/lib/apt/lists/*

# Copy build artifacts and environment
COPY --from=builder /app ./
COPY --from=builder /venv /venv

# Ensure virtualenv is available
ENV PATH="/venv/bin:${PATH}"

# Expose frontend and backend ports
EXPOSE 3000 8000

# Default command
CMD ["npm", "start"]

