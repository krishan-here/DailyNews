const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const { response } = require("express");
const { get } = require("http");
const { stringify } = require("querystring");
const app = express();

// connecting database
mongoose.connect(
  "mongodb+srv://admin-dipanshu:Dipanshu@123@cluster0.hwkix.mongodb.net/newsDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

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

// for including all css & image file in server
app.use(express.static(__dirname + "/public"));

//for using body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// for using ejs
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  Category.findOne({ name: "Home" }, (err, foundHome) => {
    if (err) {
      console.log(err);
      // return req.next(err);
    } else if (!foundHome) {
      const defaultHome1 = new Post({
        category: "Home",
        type: "post-1",
        title: "Nothing Post",
        body: "",
        img: "../css/image/nothing.png",
      });
      const defaultHome2 = new Post({
        category: "Home",
        type: "post-2",
        title: "Nothing Post",
        body: "",
        img: "../css/image/nothing.png",
      });
      const defaultHome3 = new Post({
        category: "Home",
        type: "post-3",
        title: "Nothing Post",
        body: "",
        img: "../css/image/nothing.png",
      });

      const Home = new Category({
        name: "Home",
        posts: [defaultHome1, defaultHome2, defaultHome3],
      });

      Home.save();
      // res.redirect("/");
      res.render("home", {
        category: "Home",
        posts: Home.posts,
        trend: [],
      });
    } else {
      Category.findOne({ name: "Home" }, (err, foundHome) => {
        if (err) {
          console.log(err);
        } else {
          Category.findOne({ name: "Trend" }, (err, foundTrend) => {
            if (!err) {
              if (!foundTrend) {
                res.render("home", {
                  category: "Home",
                  posts: foundHome.posts,
                  trend: [],
                });
              } else {
                res.render("home", {
                  category: "Home",
                  posts: foundHome.posts,
                  trend: foundTrend.posts,
                });
              }
            }
          });
        }
      });
    }
  });
});

const categoryArray = ["Fitness", "Bollywood", "Sports"];

categoryArray.forEach((categoryItem) => {
  app.get(`/${categoryItem}`, (req, res) => {
    Category.findOne({ name: categoryItem }, (err, foundCategory) => {
      if (err) {
        console.log(err);
      } else if (!foundCategory) {
        //nothing posted
        const default1 = new Post({
          category: categoryItem,
          type: "post-1",
          title: "Nothing Post",
          body: "",
          img: "../css/image/nothing.png",
        });
        const default2 = new Post({
          category: categoryItem,
          type: "post-2",
          title: "Nothing Post",
          body: "",
          img: "../css/image/nothing.png",
        });
        const default3 = new Post({
          category: categoryItem,
          type: "post-3",
          title: "Nothing Post",
          body: "",
          img: "../css/image/nothing.png",
        });

        if (categoryItem == "Fitness") {
          const Fitness = new Category({
            name: "Fitness",
            posts: [default1, default2, default3],
          });
          Fitness.save();
        } else if (categoryItem == "Bollywood") {
          const Bollywood = new Category({
            name: "Bollywood",
            posts: [default1, default2, default3],
          });
          Bollywood.save();
        } else if (categoryItem == "Sports") {
          const Sports = new Category({
            name: "Sports",
            posts: [default1, default2, default3],
          });
          Sports.save();
        }

        res.render("category", {
          category: categoryItem,
          posts: [default1, default2, default3],
        });
      } else {
        res.render("category", {
          category: foundCategory.name,
          posts: foundCategory.posts,
        });
      }
    });
  });
});

//compose section
app.get("/compose", (req, res) => {
  const categoryObj = {
    Home: [],
    Fitness: [],
    Sports: [],
    Bollywood: [],
  };

  Category.find({}, (err, foundCategory) => {
    if (err) {
      console.log(err);
    } else {
      foundCategory.forEach((category) => {
        categoryObj[`${category.name}`] = category.posts;
      });
      res.render("compose", { Category: categoryObj });
    }
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
        if (!foundTrend) {
          //create trend category
          const Trend = new Category({
            name: "Trend",
            posts: [post],
          });
          Trend.save();
        } else {
          foundTrend.posts.push(post);
          foundTrend.save();
        }
      }
    });
  }
  Category.findOne({ name: categoryName }, (err, foundCategory) => {
    if (!err) {
      foundCategory.posts.push(post);
      foundCategory.save();
    }
  });
  if (categoryName == "Home") res.redirect("/");
  else res.redirect("/" + categoryName);
});

// read more section
app.get("/:postCategory/:postTitle", (req, res, next) => {
  const category = req.params.postCategory;
  const title = req.params.postTitle;
  if (title == "Nothing Post") {
    if (category == "Home") res.redirect("/");
    else res.redirect("/" + category);
  } else {
    Category.findOne({ name: category }, (err, foundCategory) => {
      if (err) {
        console.log(err);
      } else {
        foundCategory.posts.forEach((post) => {
          //click on post
          if (post.title == title) {
            res.render("fullpost", { category: category, post: post });
          }
        });
      }
    });
  }
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
      }
    }
  );

  // delete if it is on trend also
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

let port = Process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("server has started!");
});
