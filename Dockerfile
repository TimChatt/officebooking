FROM node:20 AS deps

WORKDIR /app

# Only copy package.json
COPY package.json ./
COPY packages ./packages

# Fallback to full install since no lockfile
RUN npm install

# Build your web app
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=deps /app /app

CMD ["npm", "start"]
