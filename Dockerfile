# Phase 1: Dependencies
FROM node:20 AS builder
WORKDIR /app
# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY package.json ./
COPY packages ./packages

# Install node dependencies
RUN npm install --legacy-peer-deps --no-audit --prefer-online

# Build frontend assets
RUN npm run build

# Install Python deps for forecast service
RUN pip install --no-cache-dir -r packages/forecast/requirements.txt

FROM node:20-slim AS runner
WORKDIR /app
# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app ./

EXPOSE 3000
EXPOSE 8000
CMD ["npm", "start"]
