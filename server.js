var express = require("express");
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require('request');


// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/designnews", {
  useMongoClient: true
});

// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/topic/subject/design").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article
        .create(result)
        .then(function(dbArticle) {
          // If we were able to successfully scrape and save an Article, send a message to the client
          res.send("Scrape Complete");
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          console.log("there is an error")
          res.json(err);
        });
    });
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article
    .find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// // populate note
// app.get("/articles/:id", function(req, res) {
//   db.Article
//     .findOne({_id: req.params.id})
//     .populate("note")
//     .then(function(dbArticle){
//       res.json(dbArticle);
      
//     })
//     .catch(function(err){
//       res.json(err);
//     });
 
// });

// app.post("/articles/:id", function(req, res) {
//   db.Note
//     .create(req.body)
//     .then(function(dbNote){
//       return dbArticle.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, 
//         {new: true});
//       })
//     .then(function(dbArticle){
//       res.json(dbArticle);
//     })
//     .catch(function(err){
//       res.json(err);
//     });

// });



// // Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});