# Stage 1: Build the React Client
FROM node:20 AS frontend-builder
WORKDIR /app/client

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy the rest of the client code and build
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Express Server
FROM node:20
WORKDIR /app

# Copy server package files and install dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy the rest of the server code
COPY server/ ./

# Copy the built React app from Stage 1 into the server's public directory
COPY --from=frontend-builder /app/client/dist ./public

# Expose port 5000 for the Express server
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
