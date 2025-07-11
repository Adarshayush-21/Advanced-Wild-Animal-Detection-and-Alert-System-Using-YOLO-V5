# Frontend Dockerfile
FROM node:18-alpine AS frontend

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Backend Dockerfile
FROM python:3.9-slim AS backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgstreamer1.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY backend/ .
COPY best.pt .
COPY alarm.mp3 .

# Expose port
EXPOSE 8000

# Final stage - combine both
FROM nginx:alpine AS production

# Copy frontend build
COPY --from=frontend /app/.next /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy backend (would typically be separate container)
COPY --from=backend /app /backend

EXPOSE 80 8000

CMD ["nginx", "-g", "daemon off;"]