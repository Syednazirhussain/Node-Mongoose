const axios = require("axios");
const { ObjectId } = require("mongodb");
const User = require("../model/User");

const send = async (req) => {
  try {
    let device_token = await User.findOne({
      email: "tatozynyj@mailinator.com",
    });
    device_token = device_token.devices[0].device_token;

    const headers = {
      Authorization: "key=" + process.env.FCM_SERVER_KEY,
    };

    const notification = {
      notification: {
        title: req.body.title,
        body: req.body.body,
        click_action: "http://localhost:5000/",
      },
      to: device_token,
    };

    axios
      .post("https://fcm.googleapis.com/fcm/send", notification, {
        headers: headers,
      })
      .then((res) => {
        console.log(`Status: ${res.status}`);
        console.log("Body: ", res.data);
      })
      .catch((err) => {
        return { error: 1, message: err };
      });

    return { error: 0, message: "Notification sent successfully" };
  } catch (error) {
    return { error: 1, message: error.message };
  }
}

module.exports = {
    send
}
