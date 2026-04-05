FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

# The code will be mounted from the host
CMD ["npm", "run", "dev"]
