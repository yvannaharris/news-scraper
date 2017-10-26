var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");

//var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static("public"));

console.log("\n***********************************\n" +
            "Grabbing articles\n" +
            "from CNN Technology" +
            "\n***********************************\n");

request("https://www.nytimes.com/section/technology?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Tech&WT.nav=page", function(error, response, html) {
	var $ = cheerio.load(html);

	var results = [];
	$("div.story-body").each(function(i, element) {
		var headline = $(element).find("h2.headline").text();

		var link = $(element).find("a").attr("href");

		var summary = $(element).find("p.summary").text();

		results.push({
			headline: headline,
			link: link,
			summary: summary
		});
	});

	console.log(results);
});
