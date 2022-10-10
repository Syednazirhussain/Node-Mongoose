const { MongoClient } = require('mongodb')

const url = process.env.DB_URI
const client = new MongoClient(url, {
  useUnifiedTopology: true
})

const createPermission = async (req, res) => {

    try {
  
        let inputs = req.body 

        let inputWithDate = inputs.map((o) => {
            return { ...o, "created_at": new Date().toISOString()}
        })

        console.log(inputWithDate)

        const newPermissions = await client.db("node-mongoose")
                                            .collection('permissions')
                                            .insertMany(inputWithDate)

        res.json(newPermissions)
  
    } catch (error) {
  
      res.json({ error: 2, message: error.message })
    }
  }
  
  module.exports = {
    createPermission
  }