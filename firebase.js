import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";;


const firebaseConfig = {
  apiKey: "AIzaSyA4i_DxWMxrl9yqKoPjsG8mKn5Dy8EJOMQ",
  authDomain: "secondproject-76902.firebaseapp.com",
  projectId: "secondproject-76902",
  storageBucket: "secondproject-76902.firebasestorage.app",
  messagingSenderId: "156455349992",
  appId: "1:156455349992:web:47f77e357fb79aae2ea35d",
  measurementId: "G-602VDQN4XR"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export { auth, createUserWithEmailAndPassword, provider, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, sendPasswordResetEmail, db, doc, setDoc, collection, getDocs, signOut, updateDoc, deleteDoc, serverTimestamp }