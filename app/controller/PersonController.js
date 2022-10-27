const { MongoClient, ObjectId } = require("mongodb");
const { StatusCodes } = require("http-status-codes");

const url = process.env.DB_URI;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
});

exports.personIndex = async (req, res) => {
  try {
    let perPage = 10;
    let page = req.params.page || 1;

    let count = await client.db("node-mongoose").collection("persons").count();

    let persons = await client
      .db("node-mongoose")
      .collection("persons")
      .find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .toArray();

    // For Search Filter

    let eyecolors = await client
      .db("node-mongoose")
      .collection("persons")
      .distinct("eyeColor")
      
    let favfruits = await client
    .db("node-mongoose")
    .collection("persons")
    .distinct("favoriteFruit")

    res.status(StatusCodes.OK).render("person/index", {
      persons: persons,
      current: page,
      pages: Math.ceil(count / perPage),
      eyecolors: eyecolors,
      favfruits: favfruits
    })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .render("errors/500", { message: error.message })
  }
}

exports.search = async (req, res) => { 
    try {

        let perPage = 10;
        let page = req.params.page || 1;

        let personsObj = {}

        let inputData = { ...req.body }

        let color = (inputData.color) ? (Array.isArray(inputData.color)) ? inputData.color : [inputData.color] : []
        let fruit = (inputData.fruit) ? (Array.isArray(inputData.fruit)) ? inputData.fruit : [inputData.fruit] : []
        
        if (inputData.name != '' && inputData.name != undefined) {
            personsObj.name = inputData.name
        }
        if (inputData.age != '' && inputData.age != undefined) {
            personsObj.age = parseInt(inputData.age)
        }
        if (inputData.gender != '' && inputData.gender != undefined) {
            personsObj.gender = inputData.gender
        }
        if (inputData.status != '' && inputData.status != undefined) {
            personsObj.isActive = JSON.parse(inputData.status)
        }
        if (color != '' && color != undefined) {
            personsObj.eyeColor = { $in: color }
        }
        if (fruit != '' && fruit != undefined) {
            personsObj.favoriteFruit = { $in: fruit }
        }

        let count = await client
          .db("node-mongoose")
          .collection("persons")
            .find(
                  personsObj
            ).count()
        
        let persons = await client
          .db("node-mongoose")
          .collection("persons")
            .find(
                  personsObj
            ).skip(perPage * page - perPage)
            .limit(perPage)
            .toArray();

        // For Search Filters

        let eyecolors = await client
        .db("node-mongoose")
        .collection("persons")
        .distinct("eyeColor")
        
        let favfruits = await client
        .db("node-mongoose")
        .collection("persons")
        .distinct("favoriteFruit")
        
        res.status(StatusCodes.OK).render("person/index", {
            persons: persons,
            current: page,
            pages: Math.ceil(count / perPage),
            eyecolors: eyecolors,
            favfruits: favfruits
        })

    } catch (error) { 
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .render("errors/500", { message: error.message })
    }
}