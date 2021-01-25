// Import the necessary packages
const mongoose = require("mongoose");

// import user-defidned modules
const Article = require("./Article");
const User = require("./User");

// Create Schema for Article
const ContributorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
        },
        photo: {
            type: String,
        },
        contributions: [
            {
                type: String,
                required: true,
            },
        ],
        articles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Article",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contributor", ContributorSchema);
