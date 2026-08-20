# --- Stage 1: Build stage ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install all dependencies (including devDependencies required for the build)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Run build scripts to compile, minify and secure files
RUN npm run build:all

# Set up main.html (matching deployment script behavior)
RUN cp ggone_pro.secure.html main.html


# --- Stage 2: Production runner stage ---
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy package configuration files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy only the necessary build artifacts and static assets from builder stage
COPY --from=builder /app/ggone_pro.secure.html ./
COPY --from=builder /app/ggone_pro.clean.html ./
COPY --from=builder /app/main.html ./
COPY --from=builder /app/index.html ./
COPY --from=builder /app/proxy-server.js ./
COPY --from=builder /app/images ./images
COPY --from=builder /app/scripts ./scripts

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
