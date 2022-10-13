const FCM  = require('fcm-node')

const fcm = new FCM(process.env.FCM_SERVER_KEY)


exports.pushNotification = async ({ subject, meesage, devices, refid, click_action }) => {
    
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    let message = { 
        registration_ids: devices,
        notification: {
            title: subject,
            body: meesage,
            click_action: click_action,
            sound: 'default',
            tracking: refid
        },
        data: {  //you can send only notification or only data(or include both)
            title: subject,
            message: meesage,
            click_action: click_action,
            sound: 'default',
            tracking: refid
        }
    };

    await fcm.send(message, (err, response) => {
        if (err) {
            console.log("Error", err)
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
}