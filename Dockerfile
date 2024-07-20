# Stage 1: Build the frontend
FROM node:22-alpine as frontend-builder
WORKDIR /app/frontend
COPY icam-expert-frontend/package*.json ./
RUN npm install
COPY icam-expert-frontend .
RUN npm run build

# Stage 2: Build the backend
FROM node:22-bullseye-slim as backend-builder
WORKDIR /app/backend
COPY icam-expert-backend/package*.json ./
RUN npm install
COPY icam-expert-backend .
RUN npm run build

# Stage 3: Create the final image with FFmpeg
FROM node:22-slim
# Install FFmpeg and other dependencies
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=frontend-builder /app/frontend/build ./frontend/build
COPY --from=backend-builder /app/backend ./backend
RUN npm install -g ts-node
EXPOSE 3000
WORKDIR /app/backend

# Start the backend and frontend together with increased memory limit
CMD ["node", "--max_old_space_size=2048", "-r", "ts-node/register", "src/index.ts", "--env=production"]
