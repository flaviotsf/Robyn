# Stage 1: Building the code
FROM node:latest AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy package.json
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Build the Next.js app
RUN pnpx prisma generate
RUN pnpx next telemetry disable

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

RUN pnpm run build

FROM robyn-base as base

# Update the package list and install necessary dependencies
RUN apt-get update && apt-get install -y curl software-properties-common

ARG NODE_VERSION=18
# install NodeJS
RUN apt-get update -yq \
    && apt-get install -yq ca-certificates curl gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_VERSION.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update -yq \
    && apt-get install nodejs -yq \
    && npm install -g npm

# Set the working directory
WORKDIR /app

# Copy the build output to the new working directory
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm",  "run", "start:migrate:prod"]