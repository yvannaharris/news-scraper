var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var request = require("request");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/newsScraper", {
	useMongoClient: true
});


app.get("/scrape", function(req, res) {
	request("https://www.nytimes.com/section/technology?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Tech&WT.nav=page", function(error, response, html) {
		var $ = cheerio.load(html);

		$("div.story-body").each(function(i, element) {

			var result = {};

			result.headline = $(this).find("h2.headline").text();

			result.link = $(this).find("a").attr("href");

			result.summary = $(element).find("p.summary").text();

			db.Article.create(result).then(function(dbArticle) {
				res.send("Scrape Complete");
			})
			.catch(function(err) {
				res.json(err);
			});
		});
	}); 
});

app.get("/articles", function(req, res) {
	db.Article.find({}).then(function(dbArticle) {
		res.json(dbArticle);
	})
	.catch(function(err) {
		res.json(err);
	});
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

