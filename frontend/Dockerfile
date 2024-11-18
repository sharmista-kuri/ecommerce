# Use Node.js as a base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Use a simple server like `serve` to serve the static files
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
