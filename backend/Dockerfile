# Use the official Node.js 20 image
FROM node:20-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy local code to the container image
COPY . .

# Set environment variables for production
ENV NODE_ENV=production

# Service binds to port 8080 by default on Cloud Run
ENV PORT=8080
EXPOSE 8080

# Run the web service on container startup
CMD [ "npm", "start" ]
