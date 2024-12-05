# Use Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port React listens on
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]
