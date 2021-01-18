// Import the necessary packages
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const ejs = require("ejs");
const path = require("path");

// Importing the user-defined modules here
const User = require("./models/User");

// create the instance of out app
const app = express();

// Make our app to use these
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

// Get the environment variables here
const PORT = process.env.PORT || 4000;

// Get the url string for mongoDB connection from environment variable
const uri = process.env.MONGODB_URI;

// MongoDB Connection
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, //used for index warning, remove this if this creates some errors
});

const connection = mongoose.connection;
connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});

// Adding Ejs Render Mehthod for email tempalte
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Backend/views"));

// *******************************************
// These are the routes of our api endpoint

const homeRouter = require("./routes/Home");
app.use("/api", homeRouter);

const userRouter = require("./routes/User");
app.use("/api/user", userRouter);

const verifyRouter = require("./routes/Verify");
app.use("/api/verify", verifyRouter);

const contributorsRouter = require("./routes/Contributors");
app.use("/api", contributorsRouter);

// ******************************

// Start the server in the specified port number which is there in the environment variable
app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
