FROM node:20-alpine

# 1. Working directory
WORKDIR /app

# 2. Copy only package files first to leverage caching
COPY package*.json ./

# 3. Install dependencies (use --only=production for production environment)
RUN npm ci --only=production

# 4. Copy the rest of the code
COPY . .

# 5. Environment variable (can be overridden in docker-compose)
ENV NODE_ENV=production

# 6. Expose port (should match the PORT used in server.js; defaults to 5000 if not set)
EXPOSE 5000

# 7. Start command: uses the "start": "node server.js" script from package.json
CMD ["npm", "start"]
