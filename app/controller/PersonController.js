const Validator = require('validatorjs')
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
      .sort({ index: 1 })
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("errors/500", { message: error.message })
  }
}

exports.personCreate = async (req, res) => {
  
  try {

    let eyeColor = ["green", "blue", "brown"]
    let fruit = ["banana", "apple", "strawberry"]

    res.status(StatusCodes.OK).render("person/create", {
      eyeColor,
      fruit
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("errors/500", { message: error.message })
  }
}

exports.personStore = async (req, res) => {
  try {

    let inputData = {...req.body}

    let rules = {
        name: 'required',
        age: 'required|numeric',
        gender: 'required',
        eyeColor: 'required',
        tags: 'required',
        title: 'required',
        email: 'required|email',
        phone: 'required',
        country: 'required',
        address: 'required|max:191',
    }

    let validator = new Validator(inputData, rules, {
        "numeric.age": ":attribute must be numeric",
        "email.email": ":attribute is not valid"
    })

    if (validator.fails()) {

        req.app.locals.fields = req.body
        console.log(validator.errors)

        let errors = [
          validator.errors.get('name'), 
          validator.errors.get('age'), 
          validator.errors.get('gender'), 
          validator.errors.get('eyeColor'), 
          validator.errors.get('tags'), 
          validator.errors.get('title'), 
          validator.errors.get('email'),
          validator.errors.get('phone'),
          validator.errors.get('country'),
          validator.errors.get('address')
        ]

        errors = errors.flatMap(e => e)
        req.flash('validation_errors', errors)

        console.log(errors);

        res.status(StatusCodes.OK).render('person/create')
    } else {

      let input = {...req.body}

      let isActive = false
      if (input.hasOwnProperty('isActive')) {
        isActive = true
      }

      let count = await client.db("node-mongoose").collection("persons").find({}).count();

      let person = {
        index: (count + 1),
        name: input.name,
        isActive: isActive,
        registered: new Date(),
        age: input.age,
        gender:  input.gender,
        eyeColor: input.eyeColor,
        favoriteFruit: input.fruit,
        company: {
          title: input.title,
          email: input.email,
          phone: input.phone,
          location: {
            country: input.country,
            address: input.address
          }
        },
        tags: input.tags.split(" ")
      }

      let newPerson = await client.db("node-mongoose")
                                  .collection('persons')
                                  .insertOne(person)

      console.log(newPerson);

      req.flash("success", "Person created successfully")
      res.status(StatusCodes.CREATED).redirect("/persons/1")
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("errors/500", { message: error.message })
  }
}

exports.personEdit = async (req, res) => {
  try {

    const person_id = req.params.id

    if (ObjectId.isValid(person_id)) {
      
      console.log("Person ID: ", person_id);

      let person = await client.db("node-mongoose")
                              .collection('persons')
                              .findOne({ _id: ObjectId(person_id) })

      console.log(person);


      // Update object by adding key value in a particular array of objects
      /*
      let isUpdated = await client.db("node-mongoose")
                              .collection('persons')
                              .updateOne(
                                // { _id: ObjectId(person_id) },
                                {
                                  device_token: {
                                    $elemMatch: {
                                      device_token: 'abcd1234'
                                    }
                                  }
                                },
                                {
                                  "$set": { "device_token.$.foo": "bar" }
                                }
                              )
      */

      // Update object key in an array of objects
      /*
      let isUpdated = await client.db("node-mongoose")
                              .collection('persons')
                              .updateOne(
                                // { _id: ObjectId(person_id) },
                                {
                                  device_token: {
                                    $elemMatch: {
                                      device_token: 7
                                    }
                                  }
                                },
                                {
                                  "$set": { "device_token.$.device_token": 'abcd1234' }
                                }
                              )
      */

      /* Remove a particular object from array of object */
      /*
      let isUpdated = await client.db("node-mongoose")
                                  .collection("persons")
                                  .updateOne(
                                    { _id: ObjectId(person_id) },
                                    // { friends: { $elemMatch: { roll_no: '13b-058-bs' } } },
                                    { $pull: { device_token: { foo: 'bar' } } }
                                  )
      */
      // console.log(isUpdated);

      /* Remove elements from an array */
      /*
      let isUpdated = await client.db("node-mongoose")
                              .collection('persons')
                              .updateOne(
                                { _id: ObjectId(person_id) },
                                // { $pull: { i: { $in: [ "m", "o" ] } } }
                                // { $unset : { bar : 1 } }
                                { $unset : { i : 1 } } // this is an array of elements
                              )
      */



      // Add array of objects
      /*
      let isUpdated = await client.db("node-mongoose")
                                  .collection("persons")
                                  .updateOne(
                                    { _id: ObjectId(person_id) },
                                    { $set: { friends: [
                                          { name: 'Hamza', roll_no: '13b-034-bs' },
                                          { name: 'Onais', roll_no: '13b-041-bs' },
                                          { name: 'Taha', roll_no: '13b-058-bs' },
                                        ]
                                      } 
                                    }
                                  )
      console.log(isUpdated);
      */

      /* Add new array of item */
      /*
      let isUpdated = await client.db("node-mongoose")
                              .collection('persons')
                              .updateOne(
                                { _id: ObjectId(person_id) },
                                {
                                  // $push: { // add new element in an array
                                  //   x: 'y'
                                  // },
                                  $set: { // first time add array of elements
                                    'i': ['m', 'n', 'o']
                                  },
                                }
                              )
      */

      /* Add new key value pair */
      // let isUpdated = await client.db("node-mongoose")
      //                         .collection('persons')
      //                         .updateOne(
      //                           { _id: ObjectId(person_id) },
      //                           {
      //                             $set: {
      //                               bar: 'baz'
      //                             },
      //                           }
      //                         )

      /* Normal update */
      // let isUpdated = await client.db("node-mongoose")
      //                         .collection('persons')
      //                         .updateOne(
      //                           { _id: ObjectId(person_id) },
      //                           {
      //                             $set: {
      //                               name: 'Syed Nazir Hussain'
      //                             },
      //                           }
      //                         )

    }


    req.flash("success", "Person updated successfully")
    res.status(StatusCodes.OK).redirect('/persons/1')
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('errors/500', { message: error.message })
  }
}