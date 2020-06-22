FROM node:10-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

RUN apk add --no-cache bash

SHELL ["/bin/bash", "-c"]
RUN ln -fs /bin/bash /bin/sh

EXPOSE 4004

CMD ['service', 'mongod', 'start']
CMD [ "node", "index.js" ]

COPY . .

#RUN service mongod start
#ENTRYPOINT service mongod start && bash
