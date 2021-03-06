var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var mongoose_delete = require('mongoose-delete');
var bodyParser = require("body-parser");


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

mongoose.connect(MONGODB_URI, { 
  useFindAndModify: false
 });

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
  defaultLayout: "main",partialsDir: __dirname + "/views/partials/"
}));
app.set("view engine", "handlebars");


// Routes
require("./routes/apiRoutes")(app);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});