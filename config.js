import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDGZGQubA3nnKxXWY1splISusplbTx0kwY",
    authDomain: "wireleibraryapp-312fe.firebaseapp.com",
    projectId: "wireleibraryapp-312fe",
    databaseURL: "https://wireleibraryapp-312fe.firebaseio.com",
    storageBucket: "wireleibraryapp-312fe.appspot.com",
    messagingSenderId: "449261951822",
    appId: "1:449261951822:web:8346ed31d4e878d5e7dc1f"
  };
  //if(! firebase) 
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();