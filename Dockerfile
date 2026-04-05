FROM node:20-alpine

# Set working directory
WORKDIR /app

# Temporarily copy package files to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build frontend
RUN npm run build

# The rest is mounted via volume in compose for dev, 
# but for production we just serve or use the build.
CMD ["npm", "run", "preview", "--", "--host"]
