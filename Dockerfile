# Use the official Node.js 20 image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /meleket

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the prisma directory
COPY prisma ./prisma

# Copy the .env file
# COPY .env ./

# Set build argument for DATABASE_URL
ARG DATABASE_URL

# Set environment variable for Prisma
ENV DATABASE_URL=${DATABASE_URL}



# Install dependencies
RUN npm i -g @nestjs/cli

RUN npm install

RUN npx prisma generate 

# RUN npx prisma db push

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# start the app 
 RUN npm run prod

# Expose the application port (if it needs to communicate over HTTP, otherwise omit)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start:prod"]
