# PMA backend API — build from repository root (pma-be).
# docker compose build context: ../..  (see docker-compose.yml)

FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

# apidoc is a devDependency; generate docs then drop dev packages for a smaller runtime image.
RUN npm run docs && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 5020

CMD ["node", "index.js"]
