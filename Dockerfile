# Stage 1 – Base image & install dependencies
FROM node:18 AS deps

WORKDIR /app

# Copy ONLY package files first (for dependency caching)
COPY package.json package-lock.json ./
COPY packages/web/package.json packages/web/
COPY packages/server/package.json packages/server/

# ✅ This now works because package-lock.json is present!
RUN npm ci

# Stage 2 – Build app
FROM deps AS builder

WORKDIR /app
COPY . .

# Optional: build the frontend
RUN npm run build:web

# Stage 3 – Final runtime image
FROM node:18 AS runner

WORKDIR /app

# Copy all app files and built output
COPY --from=builder /app /app

# Start all services
CMD ["npm", "start"]
