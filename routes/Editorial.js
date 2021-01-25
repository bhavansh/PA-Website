// Import the necessary packages
const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const passport = require("passport");
// Getting Controllers from Controllers File
const {
    getAllEditorial,
    getEditorialbyId,
    getAllEditorialbyUser,
    createEditorial,
    enterComment,
    updateEditorial,
    deleteEditorial,
} = require("../controller/Editorial");

router.get("/all", getAllEditorial);
router.get("/:editorialId", getEditorialbyId);
router.get("/user/:userId", getAllEditorialbyUser);

router.post(
    "/create",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    createEditorial
);
router.post(
    "/comment/:editorialId",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    enterComment
);

router.put(
    "/:editorialId",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    updateEditorial
);

router.delete(
    "/:editorialId",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    deleteEditorial
);

module.exports = router;
