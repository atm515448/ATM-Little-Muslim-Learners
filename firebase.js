
"use strict";

/* ATM Little Muslim Learners
   Firebase connection
   ATM Digital Solutions & Services
*/

const firebaseConfig = {
  apiKey: "AIzaSyBh3p0vfYNFTlW1p48HbrUD4hfeE2AXqFA",
  authDomain: "atm-little-muslim-learners.firebaseapp.com",
  projectId: "atm-little-muslim-learners",
  storageBucket: "atm-little-muslim-learners.firebasestorage.app",
  messagingSenderId: "641007121572",
  appId: "1:641007121572:web:d225a0494a568690b6a231"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Connect Authentication and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Make Firebase available to the application
window.LMLFirebase = {
  auth: auth,
  db: db,

  // Start a secure anonymous visitor session
  ready: auth.signInAnonymously()
    .then(userCredential => {
      console.log("Firebase visitor session ready.");
      return userCredential.user;
    })
    .catch(error => {
      console.error("Firebase authentication error:", error);
      throw error;
    })
};

console.log("ATM Little Muslim Learners Firebase initialized.");
