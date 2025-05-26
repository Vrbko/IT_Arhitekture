FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the app
COPY . .

# Create the output directory and set permissive rights
RUN mkdir -p /app/dist && chmod -R 777 /app/dist

# Also change permissions of /app just in case
RUN chmod -R 777 /app

# Use a non-root user explicitly for compatibility with OpenShift
USER node
RUN mkdir -p /app/dist && chown -R node:node /app/dist
# Expose the port your app runs on
EXPOSE 8080

# Start the app
CMD ["yarn", "start"]