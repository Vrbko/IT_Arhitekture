FROM node:18

# Create a non-root writable app directory
WORKDIR /app

# Ensure npm doesn't try to use root-owned /.npm
ENV NPM_CONFIG_CACHE=/app/.npm

# Copy package files and install dependencies
COPY package*.json ./

# Create writable npm cache directory
RUN mkdir -p /app/.npm && chmod -R 777 /app/.npm

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Make everything writable by arbitrary UID
RUN chmod -R 777 /app
RUN chmod -R 777 /.npm
RUN sudo chown -R 1004370000:0 "/.npm"
# Expose if needed
EXPOSE 3000

# Run the app
CMD ["npm", "start"]