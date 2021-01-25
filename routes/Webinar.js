// Import the necessary packages
const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const passport = require("passport");
// Getting Controllers from Controllers File
const {
    getAllWebinar,
    getWebinarbyId,
    createWebinar,
    updateWebinar,
    deleteWebinar,
} = require("../controller/Webinar");

router.get("/all", getAllWebinar);
router.get("/:webinarId", getWebinarbyId);

router.post(
    "/create",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    createWebinar
);

router.put(
    "/:webinarId",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    updateWebinar
);

router.delete(
    "/:webinarId",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    deleteWebinar
);

module.exports = router;
