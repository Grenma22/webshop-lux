FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

# Run the app
CMD ["node", "index.js"]
