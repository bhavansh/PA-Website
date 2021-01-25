// Import the necessary packages
const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");

var auth = require("../controller/auth");
var user_controller = require("../controller/user_controller");

userRouter.post("/register", auth.register);
userRouter.post("/login", auth.login);
userRouter.post("/login/facebook", auth.facebooklogin);
userRouter.post("/login/linkedin", auth.linkedinlogin);
userRouter.post("/login/google", auth.googlelogin);
userRouter.post("/login/github", auth.githublogin);

// Example on how to use admin authorization
userRouter.get(
    "/isAuthenticatedAdmin",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    auth.isAuthenticated
);

userRouter.post(
    "/createTodo",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    user_controller.createTodo
);

userRouter.get(
    "/isAuthenticated",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAuthenticated
);

// get info about user profile and the todos that person has created
// make sure this is the last route, otherwise it will be matched for other routes and will throw unotherzed access
// url: `${baseUrl}/api/user/${user._id}`;

userRouter.get(
    "/:username",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    user_controller.profile
);

module.exports = userRouter;
