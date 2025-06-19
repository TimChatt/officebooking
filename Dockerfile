# Stage 1 – Dependencies
FROM node:18 AS deps

WORKDIR /app

# Copy only package.json and lockfile first
COPY package.json package-lock.json ./
COPY packages/web/package.json packages/web/
COPY packages/server/package.json packages/server/

RUN npm ci

# Stage 2 – Full build
FROM deps AS builder
COPY . .

# Optional: build web
RUN npm run build:web

# Stage 3 – Final runtime
FROM node:18 AS runner

WORKDIR /app

COPY --from=builder /app /app

CMD ["npm", "start"]
