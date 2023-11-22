FROM flaviosf310/robyn-base:latest as base

# Update the package list and install necessary dependencies
RUN apt-get update && apt-get install -y curl software-properties-common

# Install Node.js from the NodeSource repository
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash -
RUN apt-get install -y nodejs

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
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm",  "run", "start:migrate:prod"]