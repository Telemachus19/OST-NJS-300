const express = require("express");
const app = express();
const path = require("path");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (password.length < 8) {
    res.send("Error: Password is less than 8 characters");
  } else {
    res.send(`Registration success. Welcome, ${name}!`);
  }
});

app.listen(4000, () => {
  console.log("Express App running on http://localhost:4000");
});
