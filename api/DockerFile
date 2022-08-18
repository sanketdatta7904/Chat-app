FROM node:16.16.0 AS Production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .
 
RUN yarn run build-ts

EXPOSE 9000

CMD [ "yarn","run", "start"]