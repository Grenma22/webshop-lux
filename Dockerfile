FROM node:20-alpine

# Set working directory
WORKDIR /app

# Temporarily copy package files to install dependencies
COPY package.json package-lock.json ./

# Install dependencies (only required on first build if node_modules isn't mounted properly)
RUN npm install

# The rest is mounted via volume in compose
CMD ["npm", "run", "dev"]
