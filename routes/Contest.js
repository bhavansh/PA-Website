// Import the necessary packages
const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const passport = require("passport");

// Getting Controllers from Controllers File
const {
    getAllContest,
    getContestbyId,
    createContest,
    updateContest,
    deleteContest,
} = require("../controller/Contest");

router.get("/all", getAllContest);
router.get("/:contestId", getContestbyId);

router.post(
    "/create",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    createContest
);

router.put(
    "/:contestId",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    updateContest
);

router.delete(
    "/:contestId",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    deleteContest
);

module.exports = router;
