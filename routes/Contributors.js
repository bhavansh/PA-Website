// Import the necessary packages
const express = require("express");
const contributorsRouter = express.Router();

// Getting Controllers from Controllers File
const Contributors = require("../controller/Contributors");

// url: `${baseUrl}/api/contributors`;

// router.post("/requestcode", SecretCode.sendcode);
contributorsRouter.get("/contributors", Contributors.getContributors);
// contributorsRouter.post("/contributors", Contributors.postContributors);

module.exports = contributorsRouter;
