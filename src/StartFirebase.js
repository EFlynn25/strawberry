import firebase from 'firebase/app';

// Configure Firebase.
export const config = {
  apiKey: 'AIzaSyB3EjwyMucgeEMyfxOmSR_feJmghVwrgiw',
  authDomain: 'strawberry-5dd4a.firebaseapp.com',
  // ...
};
firebase.initializeApp(config);

// Configure FirebaseUI.
export const uiConfig = {
  signInFlow: 'redirect',
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
};
