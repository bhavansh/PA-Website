// Import the necessary packages
const mongoose = require("mongoose");

const Article = require("./Article");

// Create Schema for Article
const DomainSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        articles: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Article",
                },
                title: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Domain", DomainSchema);
