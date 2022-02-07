const express = require("express");
const { connect } = require("mongoose");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const morgan = require("morgan");
const routes = require("./routes");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ credentials: true, origin: process.env.FRONT_END_URL }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use(passport.initialize());
require("./config/passport")(passport);

const CONNECTION_URL = process.env.DATABASE_URL;

const PORT = process.env.PORT || 5000;

connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err.message));

app.use("/api", routes);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
