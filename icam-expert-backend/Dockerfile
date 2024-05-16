# Use a specific LTS version of Node.js as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code to the working directory
COPY . .

# Install application dependencies using npm
RUN npm install --platform=linuxmusl --arch=x64 sharp

RUN npm run build

# Expose the port on which your Node.js app runs
EXPOSE 3000
