# Use official Node.js image
FROM node:16

# Create and set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port for the app (optional if testing)
EXPOSE 3000

# Run tests
CMD ["npx", "jest"]