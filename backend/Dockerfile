FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install deps
COPY ./pyproject.toml /app/pyproject.toml
RUN pip install --upgrade pip && pip install "poetry==1.8.3" \
    && poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy app
COPY ./app /app/app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
