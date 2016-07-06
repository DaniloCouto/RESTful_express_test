// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express') // call express
var app = express() // define our app using express
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var Person = require('./app/models/person')

mongoose.connect('localhost:27017') // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8080 // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router() // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
  // do logging
  console.log('Something is happening.')
  next(); // make sure we go to the next routes and don't stop here
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
  res.json({ message: 'edsan' })
})

router.route('/persons')
  // create a bear (accessed at POST http://localhost:8080/api/persons)
  .post(function (req, res) {
    var persons = new Person() // create a new instance of the Bear model
    persons.name = req.body.name; // set the persons name (comes from the request)
    // save the bear and check for errors
    persons.save(function (err) {
      if (err)
        res.send(err)

      res.json({ message: 'Person created!' })
    })
  })
  .get(function (req, res) {
    Person.find(function (err, persons) {
      if (err)
        res.send(err)

      res.json(persons)
    })
  })

router.route('/persons/:person_id')

  // get the bear with that id (accessed at GET http://localhost:8080/api/persons/:person_id)
  .get(function (req, res) {
    Person.findById(req.params.person_id, function (err, person) {
      if (err)
        res.send(err)
      res.json(person)
    })
  })
  .put(function (req, res) {
    // use our bear model to find the bear we want
    Person.findById(req.params.person_id, function (err, person) {
      if (err)
        res.send(err)

      person.name = req.body.name // update the bears info

      // save the bear
      person.save(function (err) {
        if (err)
          res.send(err)
        res.json({ message: 'person updated!' })
      })
    })
  })
  .delete(function(req, res) {
        Person.remove({
            _id: req.params.person_id
        }, function(err, person) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router)

// START THE SERVER
// =============================================================================
app.listen(port)
console.log('Magic happens on port ' + port)
