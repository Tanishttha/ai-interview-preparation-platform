FROM node:20-alpine

# openssl + libc6-compat are required for Prisma's query engine on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Generate the Prisma client (needs the schema, not the full source)
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the source and build client + server bundles
COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
