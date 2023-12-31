const path = require("path");
const express = require('express');
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
console.log(PORT);

mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB Connected"));


const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const { log } = require("console");


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/blog", blogRoute);

app.use("/user", userRoute);

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
})