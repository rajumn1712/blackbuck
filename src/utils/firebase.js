import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/messaging';
const firebaseConfig = {
    apiKey: "AIzaSyD3nPg4XTQYA1eKP-lKLOTM34ujbKSdiRA",
    authDomain: "blackbuck-8e1fe.firebaseapp.com",
    projectId: "blackbuck-8e1fe",
    storageBucket: "blackbuck-8e1fe.appspot.com",
    messagingSenderId: "818728372441",
    appId: "1:818728372441:web:56baa487e5b2de6b4456c8",
    measurementId: "G-0SWKHBNV7E"
}
firebase.initializeApp(firebaseConfig);

export default firebase;