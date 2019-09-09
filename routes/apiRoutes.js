var db = require("../models");
var axios = require("axios");
var logger = require("morgan");
var mongoose = require("mongoose");
var express = require("express");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});
var router = express.Router({
  mergeParams: true
});

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.redirect("/articles");
  });

  // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.npr.org/sections/strange-news/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      console.log(response.data);
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        result.note = [];

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      });

      // Send a message to the client
      res.send("Scrape Complete");
    });
  });


  // Route for getting all Articles from the db
  app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (data) {
        console.log(data);
        // If we were able to successfully find Articles, send them back to the client

        res.render("index", {
          articles: data,
          style: "viewIndex.css"
        });

      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

  });


  app.get("/articles-json", function (req, res) {
    db.Article.find({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get("/notes-json", function (req, res) {
    db.Note.find({})
      .then(function (dbNote) {
        res.json(dbNote);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    console.log(req.params.id);
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
        _id: req.params.id
      })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function (dbArticle) {
        // If we were able o successfully find an Article with the given id, send it back to the client
        console.log("data is: " + dbArticle);
        res.render("articles", {
          articles: dbArticle,
          style: "viewArticles.css"
        });

      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function (dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        console.log(dbNote);
        console.log(req.params.id);
        return db.Article.findOneAndUpdate({
          _id: req.params.id
        }, {
          $push: {
            note: dbNote._id
          }
        }, {
          new: true
        });
      }).then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        console.log(dbArticle);
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        console.log(err);
      });

  });

  router.delete("/deletenote/:id", urlencodedParser, function (res, req) {
    db.Note.deleteOne({
      _id: req.params.id
    }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("removed note");
      }
    });

  });



  app.get("/clearAll", function (req, res) {
    db.Article.remove({}, function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log("removed all articles");
      }
    });
    res.redirect("/articles-json");
  });

  app.get("/clearAllNotes", function (req, res) {
    db.Note.remove({}, function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log("removed all notes");
      }
    });
    res.redirect("/articles-json");
  });

};