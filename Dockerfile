# Use the official Node.js 20 image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /meleket

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the prisma directory
COPY prisma ./prisma

COPY .env ./




# Copy the rest of the application code
COPY . .

RUN npm install

# Build the application
RUN  npx prisma generate

RUN npm run build



# Expose the application port (if it needs to communicate over HTTP, otherwise omit)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start:prod"] 
