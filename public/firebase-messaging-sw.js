importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js')

/*
Initialize the Firebase app in the service worker by passing in the messagingSenderId.
*/
firebase.initializeApp({
    apiKey: "AIzaSyCvs5ciEYaYuBxdsI11pbqArRASlnBqDGA",
    authDomain: "kfs-block-2.firebaseapp.com",
    projectId: "kfs-block-2",
    storageBucket: "kfs-block-2.appspot.com",
    messagingSenderId: "250605042436",
    appId: "1:250605042436:web:535e1efd2d72ed3262ee51",
    measurementId: "G-WSWJWPMMYB"
})

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function ({ data: { title, body, icon, action_url } }) {
    self.addEventListener('notificationclick', (event) => {
        let url = action_url
        event.notification.close() // Android needs explicit close.
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                // Check if there is already a window/tab open with the target URL
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i]
                    // If so, just focus it.
                    if (client.url === url && 'focus' in client) {
                        return client.focus()
                    }
                }

                // If not, then open the target URL in a new window/tab.
                if (clients.openWindow) {
                    return clients.openWindow(url)
                }
            })
        )
    })

    return self.registration.showNotification(title, { body, icon })
})
