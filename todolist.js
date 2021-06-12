const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const age = require(__dirname + "/date.js");
let ejs = require("ejs");

const app = express();
var itemsArray = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  var day = date.todaysDate;
  res.render("list", { kindOfDay: day, newListItem: itemsArray });
});

app.post("/", (req, res) => {
  item = req.body.newItem;
  itemsArray.push(item);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("serving started at 3000");
});
