const express = require("express");
const { connectMongoDB } = require("./connection");
const path = require("path");
const cookieParser = require("cookie-parser");
const Url = require("./models/url");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8000;
// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//connect to mongodb
connectMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDB connected"),
);
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);
//defining routes
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/", staticRoute);
app.use("/user", userRoute);
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
