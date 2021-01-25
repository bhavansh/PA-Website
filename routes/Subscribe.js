// Import the necessary packages
const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const passport = require("passport");
// Getting Controllers from Controllers File
const {
    getAllEditorial,
    joinSubcriberList,
    sendMailToAll,
} = require("../controller/Subscribe");

router.get("/all", getAllEditorial);

router.post("/join", joinSubcriberList);

router.post(
    "/sendall",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    sendMailToAll
);

module.exports = router;
