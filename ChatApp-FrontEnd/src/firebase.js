// Import the functions you need from the SDKs you need
import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAchyB8o6aYRd52_AcwnNmscl5oaRoCz3Y",
  authDomain: "whatsapp-clone-116d2.firebaseapp.com",
  projectId: "whatsapp-clone-116d2",
  storageBucket: "whatsapp-clone-116d2.appspot.com",
  messagingSenderId: "266882169387",
  appId: "1:266882169387:web:66828398d59e96edcb086e"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()


export { auth, provider }
export default db