# Use the official Node.js 20 image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port (if it needs to communicate over HTTP, otherwise omit)
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
