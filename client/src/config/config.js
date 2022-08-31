const appConfig = {
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  firebaseConfig: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGIG_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  },
  pusherConfig: {
    apIKey: process.env.REACT_APP_PUSHER_API_KEY,
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  },
};
export default appConfig;
