# Use the Node.js LTS Alpine image as the base image
FROM node:lts-alpine

# Create the 'app' directory and set it as the working directory
RUN mkdir -p /app
WORKDIR /app

# Set environment variables
ENV APP_VERSION=v1

# Install app dependencies using pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

# Copy app source code and configuration files into the working directory
COPY src ./src
COPY tsconfig.json ./

# List all the files and folders in the working directory for debugging
# Note: To see the output of this command, use the flag '--progress=plain'
RUN ls -l

# Build the app source code
RUN pnpm build

# Set the default command to run when the container starts
CMD [ "pnpm", "start" ]

# Expose port 5000 for external access
EXPOSE 5000