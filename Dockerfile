# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:20-alpine

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
COPY package*.json ./

# Install production dependencies.
# This skips devDependencies like 'vite' and 'eslint', keeping the image small.
RUN npm ci --only=production

# Copy the server script and the database file.
COPY server.cjs .
COPY db.json .

# Cloud Run invokes the container with the PORT environment variable set (usually 8080).
# We set a default just in case.
ENV PORT=8080

# Expose the port (documentation only, Cloud Run handles mapping).
EXPOSE 8080

# Run the web service on container startup.
CMD ["npm", "start"]
