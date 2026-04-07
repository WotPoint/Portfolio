FROM node:20-alpine

WORKDIR /app

# Copy package files for workspace
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install all dependencies (including dev for build)
RUN npm install --include=dev

# Copy source code
COPY . .

# Build frontend (Vite)
RUN cd frontend && node ../node_modules/vite/bin/vite.js build

# Generate Prisma client
RUN cd backend && node ../node_modules/prisma/build/index.js generate

# Compile TypeScript backend
RUN cd backend && node ../node_modules/typescript/bin/tsc

EXPOSE 3000

# On start: push DB schema, then start server
CMD ["sh", "-c", "node node_modules/prisma/build/index.js db push --schema=backend/prisma/schema.prisma && node backend/dist/index.js"]
