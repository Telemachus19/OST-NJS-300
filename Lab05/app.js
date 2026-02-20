const express = require("express");
const multer = require("multer");

const app = express();
app.set("view engine", "ejs");

const upload = multer({ dest: "./uploads/" });
app.get("/message", (req, res) => {
  res.render("message", {
    dynamicMsg: "Hello World!",
  });
});

app.get("/users", (req, res) => {
  const namesArray = ["1", "2", "3", "4", "5"];
  res.render("users", { users: namesArray });
});

app.get("/", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.single("profilePic"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file was uploaded.");
  }
  res.send(`Success! File uploaded and saved as: ${req.file.filename}`);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
