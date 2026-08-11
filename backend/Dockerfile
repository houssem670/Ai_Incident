FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required for PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --break-system-packages --upgrade "setuptools>=80.9.0" "wheel>=0.46.2"

# Copy application
COPY . .

# Create non-root user
RUN useradd --create-home appuser

# Run application as non-root user
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]