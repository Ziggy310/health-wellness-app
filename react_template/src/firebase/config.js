// Firebase configuration file
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLMjYlBiLdwMHjXXaAqjYlCHwQLmq9cTI",
  authDomain: "menoplus-app.firebaseapp.com",
  projectId: "menoplus-app",
  storageBucket: "menoplus-app.appspot.com",
  messagingSenderId: "358745621894",
  appId: "1:358745621894:web:9c42ab8c03a6d4c3f8e4b2",
  measurementId: "G-XYZN6STH9E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, auth };