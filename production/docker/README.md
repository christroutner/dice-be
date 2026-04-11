# Docker Compose (PMA stack)

This directory runs three services:

1. **mongo** — MongoDB 7; data is stored on the host at **`pma-be/production/data/mongo`** (bind mount from `../data/mongo` next to this compose file). If the container cannot write there (Linux permissions), fix ownership for UID **999** (the `mongodb` user in the image), e.g. `sudo chown -R 999:999 ../data/mongo`.
2. **pma-be** — This repository’s Node API on port **5020** (configurable via `PMA_BE_PORT`).
3. **pma-fe** — React app cloned from [christroutner/pma-fe](https://github.com/christroutner/pma-fe) at image build time, then built and served by **nginx** on host port **8080** by default (configurable via `PMA_FE_PORT`; port 80 is avoided because it is often already in use).

## Front-end source

The **pma-fe** image does not require a local **pma-fe** checkout. The Dockerfile clones the GitHub repository (default branch `main`). Override with build args from the environment if needed:

- **`PMA_FE_REPO`** — Git remote URL (default `https://github.com/christroutner/pma-fe.git`).
- **`PMA_FE_GIT_REF`** — Branch or tag for `git clone --depth 1 --branch` (default `main`). Use a tag for reproducible builds.

The compose build context is the **pma-be** repository root (same as the **pma-be** service), so only this repo needs to be present on the host.

## Usage

From `production/docker/`:

```bash
docker compose up -d --build
```

- API: `http://localhost:5020` (REST; API docs are also mounted at `/` on that server).
- Web UI: `http://localhost:8080` (or the host port you set with `PMA_FE_PORT`; set `PMA_FE_PORT=80` if you want the standard HTTP port and nothing else is bound there).

The browser talks to the API using the URL baked in at **build time**: `REACT_APP_PMA_SERVER` (default `http://localhost:5020`). For a public deployment, set that to your API’s public URL before `docker compose build`, e.g.:

```bash
export REACT_APP_PMA_SERVER=https://api.example.com
docker compose build pma-fe --no-cache
docker compose up -d
```

Optional variables live in `.env` next to this README (see comments there).

## Running the API without Docker

From the **pma-be** repository root, after installing dependencies and with MongoDB reachable:

```bash
./production/docker/start-production.sh
```

Override `DBURL`, `PORT`, etc. in the environment as needed.
