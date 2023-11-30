FROM flaviosf310/robyn-base:latest as base

# Update the package list and install necessary dependencies
RUN apt-get update && apt-get install -y curl software-properties-common

ARG NODE_VERSION=20
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

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the Next.js app
RUN npx prisma generate
RUN npx next telemetry disable
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm",  "run", "start:migrate:prod"]