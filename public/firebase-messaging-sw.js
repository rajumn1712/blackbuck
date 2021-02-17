importScripts("https://www.gstatic.com/firebasejs/8.2.6/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.2.6/firebase-messaging.js")
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
const initMessaging = firebase.messaging();
initMessaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload?.notification?.title;
    const notificationOptions = {
        body: payload?.notification?.body,
        icon: payload?.notification?.icon
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});