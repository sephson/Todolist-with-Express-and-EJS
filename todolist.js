const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const age = require(__dirname + "/date.js");
let ejs = require("ejs");

const app = express();
var itemsArray = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todoDB", {
  useNewUrlParser: true,
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Write some code",
});

const item2 = new Item({
  name: "Eat some food",
});

const item3 = new Item({
  name: "Cook some food",
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
  var day = date.todaysDate;
  Item.find({}, (err, foundItems) => {
    //code to ensure the items to add when the server is saved or restarted
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) console.log(err);
        else console.log("Successful");
      });
      res.redirect("/");
    } else {
      res.render("list", {
        kindOfDay: day,
        newListItem: foundItems,
      });
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        //create a new list docs
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        res.redirect(`/${customListName}`);
      } else {
        res.render("list", {
          kindOfDay: foundList.name,
          newListItem: foundList.items,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.button;
  console.log(listName);

  const item = new Item({
    name: itemName,
  });

  item.save();

  if (listName === date.todaysDate) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect(`/${listName}`);
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItem = req.body.checked;
  const listName = req.body.listName;
  if (listName === date.todaysDate) {
    Item.findByIdAndRemove(checkedItem, (err) => {
      if (!err) console.log("deleted");
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      {
        $pull: { items: { _id: checkedItem } },
        function(err, foundList) {
          if (!err) {
            res.redirect("/" + listName);
          }
        },
      }
    );
  }
});

app.listen(3000, () => {
  console.log("server started at 3000");
});
