# -------------------------------------------------------
# Author: Jason Cruz
# Copyright: (c) 2026 AvertXAI. All Rights Reserved.
# Project: AvertXAI Umbrella Enterprise Web — JaxsCollectibles
# Description: Production Docker image for Next.js boilerplate demo
# License: Proprietary / Unauthorized copying strictly prohibited
# File: Dockerfile
# -------------------------------------------------------

# Stage 1 — install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2 — build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3 — production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/lib/data ./lib/data

# Ensure uploads directory exists for product image uploads
RUN mkdir -p /app/public/uploads

EXPOSE 3000
CMD ["npm", "start"]
