FROM node

RUN mkdir -p /usr/src/app
ONBUILD COPY bundle /usr/src/app
WORKDIR /usr/src/app/programs/server
ONBUILD RUN npm install

CMD ["node", "main.js"]