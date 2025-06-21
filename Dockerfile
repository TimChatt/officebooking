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

# Copy everything in the monorepo
COPY . .

# Install Node.js dependencies
RUN npm install --legacy-peer-deps --no-audit --prefer-online

# Build the frontend
RUN npm --workspace packages/web run build

# Install Python dependencies
RUN pip install --no-cache-dir -r packages/forecast/requirements.txt

# ---------- PHASE 2: Runtime ----------
FROM node:20-slim AS runner
WORKDIR /app

# Install Python runtime to support the virtual environment
RUN apt-get update && \
    apt-get install -y python3 python3-venv && \
    rm -rf /var/lib/apt/lists/*

# Copy built app and runtime dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/packages/web/dist ./packages/web/dist
COPY --from=builder /venv /venv

# Ensure virtual environment is on PATH
ENV PATH="/venv/bin:${PATH}"

# Expose ports for web and forecast services
EXPOSE 3000 8000

# Start server
CMD ["npm", "start"]

