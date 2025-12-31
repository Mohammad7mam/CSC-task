// firebase.js
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCJKgVcNNlI2okZfnP_Dy-oFXsJDbTK1L8",
  authDomain: "tst-csc.firebaseapp.com",
  databaseURL: "https://tst-csc-default-rtdb.firebaseio.com",
  projectId: "tst-csc",
  storageBucket: "tst-csc.firebasestorage.app",
  messagingSenderId: "962528233138",
  appId: "1:962528233138:web:24520b62f5862359ddebab",
};

// التهيئة إذا لم تكن موجودة
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { database };
export default firebase;