# Phase 1: Dependencies
FROM node:20 AS deps
WORKDIR /app

# Copy all required package files
COPY package.json package-lock.json ./
COPY packages ./packages

# Install using the lockfile
RUN npm install --legacy-peer-deps --no-audit --prefer-online

# Build the web app
RUN npm run build
