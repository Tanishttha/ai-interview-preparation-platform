#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "🔧 Syncing database schema with Prisma (db push)..."
  # db push (not migrate deploy) so first-run setup needs no pre-existing
  # migration files and no manual `prisma migrate` step from the user.
  npx prisma db push --accept-data-loss --skip-generate && npx tsx prisma/seed.ts || {
    echo "⚠️  Could not reach the database yet — the app will retry using its JSON fallback storage until Postgres is reachable.";
  }
else
  echo "ℹ️  No DATABASE_URL set — running on JSON file fallback storage."
fi

echo "🚀 Starting PrepAI server..."
exec "$@"
