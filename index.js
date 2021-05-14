const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const { response } = require("express");
const { get } = require("http");
const { stringify } = require("querystring");
const app = express();

// connecting database
mongoose.connect("mongodb://localhost:27017/newsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = mongoose.Schema({
  category: String,
  type: String,
  title: String,
  body: String,
  img: String,
});

const categorySchema = mongoose.Schema({
  name: String,
  posts: [postSchema],
});

const userSchema = mongoose.Schema({
  user: String,
  mail: String,
});

//creating model for database
const Post = mongoose.model("Post", postSchema);
const Category = mongoose.model("Category", categorySchema);
const Email = mongoose.model("Email", userSchema);
//create default document for fitness
const post1 = new Post({
  category: "Fitness",
  type: "post-1",
  title: "Nothing",
  body: "",
  img: "../css/image/demo2.jpg",
});
const post2 = new Post({
  category: "Fitness",
  type: "post-2",
  title:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  img: "../css/image/demo4.jpg",
});

const Fitness = new Category({
  name: "Fitness",
  posts: [post1, post2],
});

//for bollywood
const post3 = new Post({
  category: "Bollywood",
  type: "post-1",
  title:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  img: "../css/image/demo5.jpg",
});
const post4 = new Post({
  category: "Bollywood",
  type: "post-2",
  title:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  img: "../css/image/demo7.jpg",
});

const Bollywood = new Category({
  name: "Bollywood",
  posts: [post3, post4],
});

//default for sports
const post5 = new Post({
  category: "Sports",
  type: "post-1",
  title:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  img: "../css/image/demo5.jpg",
});
const post6 = new Post({
  category: "Sports",
  type: "post-2",
  title:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  img: "../css/image/demo7.jpg",
});

const Sports = new Category({
  name: "Sports",
  posts: [post5, post6],
});

//default for home
const post7 = new Post({
  category: "Home",
  type: "post-1",
  title:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  img: "../css/image/demo5.jpg",
});
const post8 = new Post({
  category: "Home",
  type: "post-2",
  title:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  img: "../css/image/demo7.jpg",
});

const Home = new Category({
  name: "Home",
  posts: [post7, post8],
});

//trending section
const post9 = new Post({
  category: "Bollywood",
  type: "post-1",
  title:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  img: "../css/image/sport.jpg",
});
const post10 = new Post({
  category: "Fitness",
  type: "post-2",
  title:
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vero, corrupti.",
  img: "../css/image/texi.jpg",
});
const Trend = new Category({
  name: "Trend",
  posts: [post9, post10],
});

// for including all css & image file in server
app.use(express.static(__dirname + "/public"));

//for using body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// for using ejs
app.set("view engine", "ejs");

//i want to delete this
const posts = {
  trend: [],
  Bollywood: [],
  Fitness: [],
  Sports: [],
};

app.get("/", (req, res) => {
  Category.find({}, (err, foundCategory) => {
    if (err) {
      console.log(err);
    } else if (foundCategory.length == 0) {
      Category.insertMany([Fitness, Bollywood, Sports, Home, Trend], (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("added Fitness, Bollywood, Sposts, Home & trend ");
          res.redirect("/");
        }
      });
    } else {
      Category.findOne({ name: "Home" }, (err, foundHome) => {
        if (err) {
          console.log(err);
        } else {
          Category.findOne({ name: "Trend" }, (err, foundTrend) => {
            if (!err) {
              res.render("home", {
                category: "Home",
                posts: foundHome.posts,
                trend: foundTrend.posts,
              });
            }
          });
        }
      });
    }
  });
});

app.get("/Fitness", (req, res) => {
  Category.findOne({ name: "Fitness" }, (err, foundCategory) => {
    if (err) {
      console.log(err);
    } else if (!foundCategory) {
      //nothing posted
      res.render("category", { category: "Fitness", posts: posts.Fitness });
    } else {
      res.render("category", {
        category: foundCategory.name,
        posts: foundCategory.posts,
      });
    }
  });
});
app.get("/Bollywood", (req, res) => {
  Category.findOne({ name: "Bollywood" }, (err, foundCategory) => {
    if (err) {
      console.log(err);
    } else if (!foundCategory) {
      //nothing posted
      res.render("category", { category: "Bollywood", posts: posts.Bollywood });
    } else {
      res.render("category", {
        category: foundCategory.name,
        posts: foundCategory.posts,
      });
    }
  });
});
app.get("/Sports", (req, res) => {
  Category.findOne({ name: "Sports" }, (err, foundCategory) => {
    if (err) {
      console.log(err);
    } else if (!foundCategory) {
      //nothing posted
      res.render("category", { category: "Sports", posts: posts.Sports });
    } else {
      res.render("category", {
        category: foundCategory.name,
        posts: foundCategory.posts,
      });
    }
  });
});

//compose section
app.get("/compose", (req, res) => {
  const category = {
    Fitness: [],
    Sports: [],
    Bollywood: [],
  };
  Category.findOne({ name: "Fitness" }, (err, found) => {
    if (!err) {
      category["Fitness"] = found.posts;
    }
  });
  Category.findOne({ name: "Sports" }, (err, found) => {
    if (!err) {
      category["Sports"] = found.posts;
    }
  });
  Category.findOne({ name: "Bollywood" }, (err, found) => {
    if (!err) {
      category["Bollywood"] = found.posts;
    }
    res.render("compose", { Category: category });
  });
});

app.post("/compose", (req, res) => {
  const categoryName = req.body.postCategory;
  const titleName = req.body.postTitle;
  const bodyName = req.body.postBody;
  const imgName = req.body.imgSrc;
  const typeName = req.body.postType;
  const istrend = req.body.trend;
  const post = new Post({
    category: categoryName,
    type: typeName,
    title: titleName,
    body: bodyName,
    img: imgName,
  });
  if (istrend) {
    Category.findOne({ name: "Trend" }, (err, foundTrend) => {
      if (!err) {
        foundTrend.posts.push(post);
        foundTrend.save();
      }
    });
  }
  Category.findOne({ name: categoryName }, (err, foundCategory) => {
    if (!err) {
      foundCategory.posts.push(post);
      foundCategory.save();
    }
  });
  res.redirect("/" + categoryName);
});

// read more section
app.get("/:postCategory/:postTitle", (req, res) => {
  const category = req.params.postCategory;
  const title = req.params.postTitle;
  Category.findOne({ name: category }, (err, foundCategory) => {
    if (!err) {
      foundCategory.posts.forEach((post) => {
        if (post.title == title) {
          res.render("fullpost", { category: category, post: post });
        }
      });
    }
  });
});

//delete post

app.post("/delete", (req, res) => {
  const categoryName = req.body.category;
  const postId = req.body.postId;

  Category.findOneAndUpdate(
    { name: categoryName },
    { $pull: { posts: { _id: postId } } },
    (err, foundCategory) => {
      if (err) {
        console.log(err);
      } else {
        // deleted successfully
        // res.redirect("/compose");
      }
    }
  );
  Category.findOneAndUpdate(
    { name: "Trend" },
    { $pull: { posts: { _id: postId } } },
    (err, foundCategory) => {
      if (err) {
        console.log(err);
      } else {
        // deleted successfully
        res.redirect("/compose");
      }
    }
  );
});

// storing mail
app.post("/sign", (req, res) => {
  const userName = req.body.userName;
  const userEmail = req.body.userEmail;

  const user = new Email({
    user: userName,
    mail: userEmail,
  });
  Email.find({ mail: userEmail }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else if (foundUser.length == 0) {
      //user not found
      user.save();
      res.redirect("/");
    } else {
      //user found
      res.redirect("/");
    }
  });
});

app.listen(3000, () => {
  console.log("server running on 3000");
});
