# Phase 1: Dependencies
FROM node:20 AS deps
WORKDIR /app

# Copy all required package files
COPY package.json package-lock.json ./
COPY packages ./packages

# Install using the lockfile
RUN npm ci

# Build the web app
RUN npm run build

# Phase 2: Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built output from deps stage
COPY --from=deps /app /app

# Default start
CMD ["npm", "start"]
