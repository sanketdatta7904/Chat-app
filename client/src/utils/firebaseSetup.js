
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import appConfig from "../config/config"

// Initialize Firebase
const app = initializeApp(appConfig.firebaseConfig);
const auth = getAuth()
const provider = new GoogleAuthProvider()
const storage = getStorage(app)



export { auth, provider,storage,ref, signInWithPopup, onAuthStateChanged, signOut, uploadBytesResumable, getDownloadURL }