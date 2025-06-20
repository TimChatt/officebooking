# Phase 1: Dependencies
FROM node:20 AS builder
WORKDIR /app

# install python3, venv support, pip
RUN apt-get update \
 && apt-get install -y python3 python3-venv python3-pip \
 && rm -rf /var/lib/apt/lists/*

# create a venv and put it on PATH
RUN python3 -m venv /venv
ENV PATH="/venv/bin:${PATH}"

# copy all your code
COPY package.json ./
COPY packages ./packages

# node deps & build
RUN npm install --legacy-peer-deps --no-audit --prefer-online
RUN npm run build

# python deps into the venv
RUN pip install --no-cache-dir -r packages/forecast/requirements.txt

# Phase 2: runtime
FROM node:20-slim AS runner
WORKDIR /app

# bring in python3-venv so your venv can run
RUN apt-get update \
 && apt-get install -y python3 python3-venv \
 && rm -rf /var/lib/apt/lists/*

# copy the app + the venv from builder
COPY --from=builder /app   ./  
COPY --from=builder /venv  /venv

# ensure the venv is on PATH
ENV PATH="/venv/bin:${PATH}"

# expose & start
EXPOSE 3000 8000
CMD ["npm","start"]
