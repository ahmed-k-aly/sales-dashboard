# Step 1: Build the React frontend
FROM node:16-alpine AS frontend-build

WORKDIR /app/frontend

# Copy the frontend code
COPY ./frontend-app /app/frontend

# Install dependencies and build the React app
RUN npm install
RUN npm run build

# Step 2: Set up the FastAPI backend
FROM python:3.9-slim AS backend-build

WORKDIR /app/backend

COPY ./wait-for-it.sh /app/backend/wait-for-it.sh

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the backend code
COPY ./backend /app/backend
RUN chmod +x /app/backend/wait-for-it.sh

# Copy the React build from the previous stage
COPY --from=frontend-build /app/frontend/build /app/backend/static

# Install FastAPI dependencies
COPY ./backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the FastAPI port
EXPOSE 8000

# Command to run FastAPI
CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- python3 /app/backend/inngest_csv.py && ./wait-for-it.sh db:5432 -- uvicorn main:app --host 0.0.0.0 --port 8000"]
