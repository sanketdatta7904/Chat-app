FROM node:16.16.0 AS Production

ENV NODE_ENV=production

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .
 
RUN yarn run build-ts

CMD [ "yarn","run","start" ]