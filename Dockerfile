# Phase 1: Dependencies
FROM node:20 AS deps
WORKDIR /app

# Copy only the files you have
COPY package.json ./
COPY packages ./packages

# Install dependencies (ignoring lockfile)
RUN npm install --legacy-peer-deps --no-audit --prefer-online

# Build the web app
RUN npm run build
