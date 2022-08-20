
FROM node:16.16.0 AS Production

ENV REACT_APP_FIREBASE_API_KEY=AIzaSyAchyB8o6aYRd52_AcwnNmscl5oaRoCz3Y
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=whatsapp-clone-116d2.firebaseapp.com
ENV REACT_APP_FIREBASE_PROJECT_ID=whatsapp-clone-116d2
ENV REACT_APP_FIREBASE_STORAGE_BUCKET=whatsapp-clone-116d2.appspot.com
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID=266882169387
ENV REACT_APP_FIREBASE_APP_ID=1:266882169387:web:66828398d59e96edcb086e
ENV REACT_APP_PUSHER_API_KEY=03dd74eaefa15e1b25a8
ENV REACT_APP_PUSHER_CLUSTER=ap2
ENV REACT_APP_BACKEND_URL=https://chat-app-799023.herokuapp.com/api/v1

WORKDIR /app/client

COPY client/package.json .
COPY client/package-lock.json .

RUN npm install

COPY client .

RUN npm run build


ENV MONGODB_URL=mongodb+srv://admin:Sanket230597@cluster0.kcvew5q.mongodb.net/?retryWrites=true&w=majority
ENV PUSHER_APPID=1444121
ENV PUSHER_KEY=03dd74eaefa15e1b25a8
ENV PUSHER_SECRET=0ba620fd0fa77562580e
ENV PUSHER_CLUSTER=ap2
ENV PUSHER_USETLS=true

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