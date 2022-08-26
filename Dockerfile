
FROM node:16.16.0 AS Production

RUN mkdir -p /app/src
RUN mkdir -p /app/client

WORKDIR /app/client

COPY client/package.json .
COPY client/package-lock.json .

RUN npm install

COPY client .

RUN npm run build

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
RUN npm install typescript -g
RUN yarn install
WORKDIR /app/src
COPY src .

RUN yarn run build-ts

CMD [ "yarn","run","start" ]
