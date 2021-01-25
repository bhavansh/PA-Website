// Import the necessary packages
const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const passport = require("passport");
// Getting Controllers from Controllers File
const SecretCode = require("../controller/SecretCode");

// url: `${baseUrl}/api/verify/${user._id}/${secretCode}`;

router.post("/requestcode", SecretCode.sendcode);
router.get("/:id&:code", SecretCode.verifycode);

module.exports = router;
