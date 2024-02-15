# Use the official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json, yarn.lock to the working directory
COPY package.json ./

# Install the application dependencies using yarn
RUN yarn

# Copy the application code to the working directory
COPY . .

# The port the application will run on
EXPOSE 3000

# Start the application using yarn
CMD ["yarn", "start:dev"]
