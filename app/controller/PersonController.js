const { MongoClient, ObjectId } = require("mongodb");
const { StatusCodes } = require("http-status-codes");

const queryString = require('query-string');

const url = process.env.DB_URI;
const client = new MongoClient(url, {
  useUnifiedTopology: true,
});

exports.personIndex = async (req, res) => {

  try {

    let perPage = 10
    let page = req.params.page || 1

    let personsObj = {}
    let color
    let fruit

    let inputData = { ...req.query }

    if (inputData.name != '' && inputData.name != undefined) {
      personsObj.name = new RegExp('.*' + inputData.name + '.*')
    }

    if (inputData.age != '' && inputData.age != undefined) {
      personsObj.age = parseInt(inputData.age)
    }

    if (inputData.gender != '' && inputData.gender != undefined) {
      personsObj.gender = inputData.gender
    }

    if (inputData.isActive != '' && inputData.isActive != undefined) {
      personsObj.isActive = JSON.parse(inputData.isActive)
    }

    if (inputData.eyeColor != '' && inputData.eyeColor != undefined) {

      if (Array.isArray(inputData.eyeColor)) {
        personsObj.eyeColor = { $in: inputData.eyeColor }
      } else {
        let color = []
        color.push(inputData.eyeColor)
        personsObj.eyeColor = { $in: color }
      }
    }
    
    if (inputData.favoriteFruit != '' && inputData.favoriteFruit != undefined) {

      if (Array.isArray(inputData.favoriteFruit)) {
        personsObj.favoriteFruit = { $in: inputData.favoriteFruit }
      } else {
        let fruit = []
        fruit.push(inputData.favoriteFruit)
        personsObj.favoriteFruit = { $in: fruit }
      }
    }

    console.log(personsObj)

    let count = await client.db("node-mongoose").collection("persons").find(personsObj).count();

    let persons = await client
      .db("node-mongoose")
      .collection("persons")
      .find(personsObj)
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

    res.locals.data = inputData
    res.locals.filters = queryString.stringify(inputData)

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