const axios = require("axios")
const { ObjectId } = require("mongodb")
const User = require("./../model/User")

const send = async (req) => {

  try {

    if (ObjectId.isValid(req.body.user_id)) {

      let user = await User.findOne({ _id: req.body.user_id }).select({ devices: 1, _id: 0 })
      // let user = await User.find({ _id: req.body.user_id }, { _id: 0, devices: 1 })

      let tokens = []
      if (user.devices.length > 0) {
        tokens = user.devices.map(o => o.device_token)
      }
      
      // https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
      
      const headers = {
        'Authorization': 'Bearer '+ process.env.FCM_SERVER_KEY,
        'Content-Type': 'application/json'
      }

      // Notification object reference
      // https://firebase.google.com/docs/cloud-messaging/http-server-ref
      // https://firebase.google.com/docs/cloud-messaging/android/device-group

      const payload = {
        data: {  //you can send only notification or only data(or include both)
          title: req.body.title,
          message: req.body.body,
          click_action: process.env.APP_BASE_PATH,
          sound: 'default'
        },
        notification: {
          title: req.body.title,
          body: req.body.body,
          click_action: process.env.APP_BASE_PATH
        },
        registration_ids: tokens, // This is for multiple devices
        // to: token, // This is for single device
      }

      axios.post(process.env.FCM_NOTIFICATION_URL, payload, {
        headers: headers
      }).then((res) => {
        // console.log(res.status)
        // console.log(res.statusText)
        console.log(res.data)
      }).catch((error) => {
        return { error: 1, message: error.message }
      })

      return { error: 0, message: "Notification sent successfully" }
    } else {

      return { error: 1, message: 'Invalid user' }
    }
  } catch (error) {

    return { error: 1, message: error.message }
  }
}

module.exports = {
  send
}
