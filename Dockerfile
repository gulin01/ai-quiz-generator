# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copy package files and install
COPY package*.json ./
RUN npm ci

# ? Copy prisma schema early so generate works
COPY prisma ./prisma

# ? Generate the Prisma client
RUN npx prisma generate 

# Now copy the full app code
COPY . .

# ? Build the app
RUN npm run build 
RUN ls -al /app/dist

# 2) Runtime stage
FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

RUN npm ci --omit=dev

EXPOSE 3002
CMD ["node", "dist/main.js"]
