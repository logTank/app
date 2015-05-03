FROM node

RUN mkdir -p /usr/src/app
COPY bundle /usr/src/app
WORKDIR /usr/src/app/programs/server
RUN npm install

CMD ["node", "main.js"]