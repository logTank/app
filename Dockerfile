FROM node:0.12.2

RUN mkdir -p /usr/src/app
COPY bundle /usr/src/app
WORKDIR /usr/src/app/programs/server
RUN npm install

CMD ["node", "main.js"]