import firebase from 'firebase';
import config from '../db/config.json'
firebase.initializeApp(config.firebaseConfig);
export default firebase;