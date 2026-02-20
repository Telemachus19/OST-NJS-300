const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 5000;
const SECRET_KEY = "my_super_secret_key_123";

app.use(bodyParser.json());
app.use(express.static("public"));

mongoose
  .connect("mongodb://127.0.0.1:27017/schoolsystem")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
});

const User = mongoose.model("User", userSchema);

// Token Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["token"] || req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, msg: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, msg: "Invalid Token" });
  }
};

// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.json({ success: true, msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error during registration" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    res.json({
      success: true,
      msg: "Login successful",
      data: { token, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error during login" });
  }
});

// Get Users (Protected)
app.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "-password");

    console.log(`User ${req.user.username} accessed user list.`);

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching users" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
