const mongoose = require('mongoose')

const connectDB = (url) => {
  console.log("DB URI", url);
  return mongoose.connect(url, {
    useNewUrlParser: true
  })
}

module.exports = {
  connectDB
}
