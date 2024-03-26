FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5301
CMD ["node", "server.js"]