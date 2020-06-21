FROM node:10-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

EXPOSE 4004

CMD [ "node", "index.js" ]

COPY . .
