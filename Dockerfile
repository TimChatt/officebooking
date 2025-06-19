# Stage 1 – Base deps
FROM node:18 AS deps

WORKDIR /app

# Copy monorepo lockfile and root package
COPY package.json package-lock.json ./

# Copy only the workspace package.jsons to install all deps
COPY packages/web/package.json packages/web/
COPY packages/server/package.json packages/server/

# ✅ THIS IS WHERE THE ERROR IS OCCURRING — lockfile must be here now
RUN ls -la && npm ci

# Stage 2 – Build phase
FROM deps AS builder
WORKDIR /app
COPY . .

# Optional: build web
RUN npm run build:web

# Stage 3 – Runtime
FROM node:18 AS runner

WORKDIR /app
COPY --from=builder /app /app

CMD ["npm", "start"]
