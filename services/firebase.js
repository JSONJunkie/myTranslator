import firebase from "firebase/app";
import "firebase/database";

const config = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "anone-ba646.firebaseapp.com",
  databaseURL: "https://anone-ba646.firebaseio.com"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const db = firebase.database();
