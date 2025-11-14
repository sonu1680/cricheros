# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy entire codebase
COPY . .

# Compile TypeScript -> dist/
RUN npm run build


# -------------------------------
# Stage 2: Production Image
# -------------------------------
FROM node:20-alpine

WORKDIR /app

# Copy only what's needed for runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000

# Start your backend
CMD ["node", "dist/server.js"]
