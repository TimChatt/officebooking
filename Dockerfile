# ---------- PHASE 1: Build ----------
FROM node:20 AS builder
WORKDIR /app

# Python for forecast service
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip && \
    rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /venv
ENV PATH="/venv/bin:${PATH}"

# Copy all files
COPY . .

# Install all Node.js deps (needed for build)
RUN npm install --legacy-peer-deps --no-audit --prefer-online

# Build frontend
RUN npm --workspace packages/web run build

# Install Python forecast deps
RUN pip install --no-cache-dir -r packages/forecast/requirements.txt

# ---------- PHASE 2: Runtime ----------
FROM node:20-slim AS runner
WORKDIR /app

# Python runtime
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Copy only what’s needed for runtime
COPY --from=builder /venv /venv
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/packages/web/dist ./packages/web/dist

# Install server production dependencies only
WORKDIR /app/packages/server
RUN npm install --production

# Set back to root app dir
WORKDIR /app

# Set venv path
ENV PATH="/venv/bin:${PATH}"

# Expose frontend/backend
EXPOSE 3000 8000

CMD ["node", "packages/server/index.js"]
