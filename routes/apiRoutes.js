var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");
module.exports = function(app) {
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
            console.log(data);
            // res.json(data);
          })
          .catch(function(err) {
            console.log(err);
            // res.json(err);
          });
      });
      res.send("scraping now");
    });
  });
};
