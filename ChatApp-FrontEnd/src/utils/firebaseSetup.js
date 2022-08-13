
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyAchyB8o6aYRd52_AcwnNmscl5oaRoCz3Y",
  authDomain: "whatsapp-clone-116d2.firebaseapp.com",
  projectId: "whatsapp-clone-116d2",
  storageBucket: "whatsapp-clone-116d2.appspot.com",
  messagingSenderId: "266882169387",
  appId: "1:266882169387:web:66828398d59e96edcb086e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const provider = new GoogleAuthProvider()
const storage = getStorage(app)



export { auth, provider,storage,ref, signInWithPopup, onAuthStateChanged, signOut, uploadBytesResumable, getDownloadURL }