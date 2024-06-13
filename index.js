import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

let posts = [];

// Date when post was created
function calculateDate() {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();
  if (day < 10) {
    day = "0" + day;
  }

  if (month < 10) {
    month = "0" + month;
  }

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET all posts
app.get("/posts", (req, res) => {
  res.json(posts);
})

// GET a specific post by id
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const findPost = posts.find((post) => post.id === id);
  if (!findPost) { 
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(findPost);
})

// POST a new post
app.post("/posts", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: calculateDate()
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// PATCH a post
app.patch("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const findPostIndex = posts.findIndex((post) => post.id === id);
  const findPost = posts.find((post) => post.id === id);
  const patchPost = {
    id: id,
    title: req.body.title || findPost.title,
    content: req.body.content || findPost.content,
    author: req.body.author || findPost.author,
    date: findPost.date
  }
  posts[findPostIndex] = patchPost;
  res.json(findPost);
});

// DELETE a specific post by id
app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const findPostIndex = posts.findIndex((post) => post.id === id);
  if (findPostIndex > -1) {
    posts.splice(findPostIndex, 1);
    res.sendStatus(200).json({ message: "Post deleted" });
  } else {
    return res.status(404).json({ message: "Post not found" });
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
