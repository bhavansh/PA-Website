const express = require("express");
const homeRouter = express.Router();

// import user-defidned modules or Schema
const Article = require("../models/Article");

homeRouter.get("/", (req, res) => {
    Article.find({})
        .sort({ _id: -1 })
        .exec((err, documents) => {
            if (err) {
                res.status(500).json({
                    message: { msgBody: "Error has occured", msgError: true },
                });
            } else {
                res.status(200).json({ articles: documents });
            }
        });
});

module.exports = homeRouter;
