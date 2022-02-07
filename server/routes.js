const express = require("express");
const router = express.Router();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user) return res.send({ redirectUrl: "/products" });
    else return res.sendStatus(401);
  }
);

router.post("/user", async (req, res) => {
  const { password, email, admin } = req.body;
  const user = await User.findOne({ email: email });
  if (user) return res.status(401).send({ message: "Email already exists" });
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) return console.error(err);
    User.create({ password: hash, email, admin }, function (err, user) {
      if (err) return console.error(err);
      return res.send(user);
    });
  });
});

router.put("/user", async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return res.status(401).send({ message: "User does not exist" });
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

module.exports = router;
