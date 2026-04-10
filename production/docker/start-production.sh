#!/bin/sh
# Run the API on the host (not in Docker). Set DBURL to your MongoDB URL.
# From the repository root:  ./production/docker/start-production.sh

cd "$(dirname "$0")/../.." || exit 1

export SVC_ENV="${SVC_ENV:-prod}"
export PORT="${PORT:-5020}"
export DBURL="${DBURL:-mongodb://127.0.0.1:27017/pma-prod}"
export DISABLE_IPFS="${DISABLE_IPFS:-true}"

exec node index.js
