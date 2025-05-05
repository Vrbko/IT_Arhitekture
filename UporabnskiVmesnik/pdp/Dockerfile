# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the app
COPY . .

# Expose the port your app runs on (adjust if needed)
EXPOSE 3001

# Start the app
CMD ["yarn", "start"]