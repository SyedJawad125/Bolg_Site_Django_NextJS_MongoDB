#!/bin/sh

set -e

# ✅ Install requirements in development mode
if [ "$DJANGO_ENV" = "development" ]; then
  echo "👉 Development mode: Installing latest requirements..."
  pip install -r requirements.txt
fi

echo "👉 Waiting for PostgreSQL..."
until nc -z db 5432; do
  echo "Postgres is unavailable - sleeping"
  sleep 10
done
echo "✅ PostgreSQL is up!"

echo "👉 Waiting for RabbitMQ..."
until nc -z rabbitmq 5672; do
  echo "RabbitMQ is unavailable - sleeping"
  sleep 10
done
echo "✅ RabbitMQ is up!"

# Run migrations only for the web container
if [ "$1" = "python" ] && [ "$2" = "manage.py" ]; then
  echo "👉 Running migrations..."
  python manage.py makemigrations --noinput
  python manage.py migrate --noinput

  echo "👉 Running scripts..."
  python add_permissions.py
  python populate.py

fi

echo "👉 Starting: $@"
exec "$@"
