// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD6VC5-9-a13i_r4dIrHcjtRjCk17imyk0',
  authDomain: 'forklift-project-84c86.firebaseapp.com',
  projectId: 'forklift-project-84c86',
  storageBucket: 'forklift-project-84c86.appspot.com',
  messagingSenderId: '704119662654',
  appId: '1:704119662654:web:d179829b4adad88815c96f',
  measurementId: 'G-3SNWZZT28C',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
