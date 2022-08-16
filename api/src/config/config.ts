import * as dotenv from 'dotenv'
dotenv.config()

export const Config = Object.freeze({
  BaseRoute: '/api',
  Port: 9000,
  mongo: {
    connectionUrl : process.env.MONGODB_URL as string
  },
  pusher: {
    appId: process.env.PUSHER_APPID as string,
        key: process.env.PUSHER_KEY as string,
        secret: process.env.PUSHER_SECRET as string,
        cluster: process.env.PUSHER_CLUSTER as string,
        useTLS: Boolean(process.env.PUSHER_USETLS) || true
}
});
