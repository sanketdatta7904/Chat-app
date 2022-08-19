FROM node:16.16.0

RUN mkdir -p /app/client
WORKDIR /app/client

COPY client/package.json .
COPY client/package-lock.json .

RUN npm install

COPY client .

RUN npm run build

FROM node:16.16.0 AS Production

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .
 
RUN yarn run build-ts

CMD [ "yarn","run","start" ]

# FROM node:16.16.0
# WORKDIR /app
# COPY client/package.json .
# COPY client/package-lock.json .
# RUN npm install
# COPY client .
# RUN npm run build

# FROM node:16.16.0 AS Production
# WORKDIR /app
# COPY package.json .
# COPY yarn.lock .
# RUN yarn install
# COPY . . 
# EXPOSE 9000
# CMD ["node", "index.js"]