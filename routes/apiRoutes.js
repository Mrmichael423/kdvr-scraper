var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");
module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index");
  });
  // scraping data from the website to store in the database
  app.get("/scrape", function(req, res) {
    axios.get("https://www.kdvr.com").then(function(response) {
      //   console.log(response);
      var $ = cheerio.load(response.data);
      $("h4.entry-title").each(function(i, element) {
        var result = {};
        result.title = $(element)
          .text()
          .trim();
        result.link = $(element)
          .find("a")
          .attr("href");
        db.Article.create(result)
          .then(function(data) {
            // res.json(data);
            console.log(data);
          })
          .catch(function(err) {
            res.json(err);
          });
        res.redirect("/");
      });
    });
  });
  //Gets articles from the database and sends them to the front end
  app.get("/articles", function(req, res) {
    db.Article.find()
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  //Finds articles by their ID
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(data) {
        return db.Article.findByIdAndUpdate(
          { _id: req.params.id },
          { $set: { note: data._id } },
          { new: true }
        );
      })
      .then(function(data) {
        res.json(data);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
};
