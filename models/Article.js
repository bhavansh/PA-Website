// Import the necessary packages
const mongoose = require("mongoose");

const Domain = require("./Domain");
const User = require("./User");

// Create Schema for Article
const AtricleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        small_description: {
            type: String,
            default: "Click on read more to read the full article.",
        },
        content: {
            type: String,
            required: true,
        },
        picture: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        ratings: {
            overall_rating_points: {
                type: Number,
                default: 0,
            },
            all_ratings: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                    rating: {
                        type: Number,
                        required: true,
                    },
                    body: {
                        type: String,
                    },
                },
            ],
        },
        numberOfViews: {
            type: Number,
            default: 0,
        },
        numberOfShares: {
            type: Number,
            default: 0,
        },
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                userName: {
                    type: String,
                },
                comment: {
                    type: String,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        author: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            authorName: {
                type: String,
            },
        },
        domains: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Domain",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Article", AtricleSchema);
