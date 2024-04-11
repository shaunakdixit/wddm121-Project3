import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDoFtstqvfG_iIZPDORJgVz2vU3yOPwqx4",
    authDomain: "movies-82a9f.firebaseapp.com",
    projectId: "movies-82a9f",
    storageBucket: "movies-82a9f.appspot.com",
    messagingSenderId: "331267534639",
    appId: "1:331267534639:web:b64fb7753990292f51bbda",
    measurementId: "G-4T9T6PJE1Y"
};
  

firebase.initializeApp(firebaseConfig);

export const database = firebase.database();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth();
