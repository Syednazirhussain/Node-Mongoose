const { initializeApp } = require('firebase/app')
require('firebase/firebase-messaging')

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCvs5ciEYaYuBxdsI11pbqArRASlnBqDGA",
    authDomain: "kfs-block-2.firebaseapp.com",
    projectId: "kfs-block-2",
    storageBucket: "kfs-block-2.appspot.com",
    messagingSenderId: "250605042436",
    appId: "1:250605042436:web:535e1efd2d72ed3262ee51",
    measurementId: "G-WSWJWPMMYB"
}

const firebase = initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(({ data: { title, body, icon } }) => {
    console.log('Outer')
    return self.registration.showNotification(title, { body, icon })
})