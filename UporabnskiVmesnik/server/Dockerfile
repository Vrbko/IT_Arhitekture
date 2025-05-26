FROM node:18-alpine

# Use OpenShift-recommended base dir
WORKDIR /opt/app

# Copy dependencies
COPY package.json yarn.lock ./

RUN yarn install

# Copy app
COPY . .

# Create writeable dist folder
RUN mkdir -p dist

# Give full open permissions to everything needed at runtime
RUN chmod -R g+rwX /opt/app

# Avoid USER declaration, OpenShift assigns a random UID at runtime
# Make sure the default user can write to /opt/app

EXPOSE 8080

CMD ["yarn", "start"]