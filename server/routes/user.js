const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

router.post("/google", async (req, res) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();

  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    User.create({ email }, function (err, user) {
      if (err) return console.error(err);
      return res.send(user);
    });
  }
  const payload = {
    id: existingUser._id,
    name: existingUser.name,
  };
  // Sign token
  jwt.sign(
    payload,
    process.env.SECRET_KEY,
    {
      expiresIn: 31556926, // 1 year in seconds
    },
    (err, token) => {
      res.cookie("token", token, { httpOnly: true });
      res.json({ success: true });
    }
  );
});

router.post("/", async (req, res) => {
  const { password, email, admin } = req.body;
  const user = await User.findOne({ email: email });
  if (user) return res.status(401).send({ message: "Email already exists" });
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) return console.error(err);
    User.create({ password: hash, email, admin }, function (err, user) {
      if (err) return console.error(err);
      return res.send({ email: user.email });
    });
  });
});

router.put("/", async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return res.status(401).send({ message: "User does not exist" });
  if (user && !user.password)
    return res
      .status(401)
      .send({ message: "You should use your signup method to login" });
  bcrypt.compare(password, user.password).then((isMatch) => {
    if (isMatch) {
      // User matched
      // Create JWT Payload
      const payload = {
        id: user._id,
        name: user.name,
        admin: user.admin,
      };
      // Sign token
      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: 31556926, // 1 year in seconds
        },
        (err, token) => {
          res.cookie("token", token, { httpOnly: true });
          res.json({ success: true });
        }
      );
    } else {
      return res.status(400).json({ message: "Password incorrect" });
    }
  });
});

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      res.clearCookie("token");
      res.send("logout successful");
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
