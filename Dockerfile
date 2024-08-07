# Use the official Node.js 20 image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /meleket

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm i -g @nestjs/cli
RUN  npm i -g @prisma/cli
RUN npm install

RUN npx prisma generate 

RUN npx prisma db push

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port (if it needs to communicate over HTTP, otherwise omit)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start:prod"]
