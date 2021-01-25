// Import the necessary packages
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;

require("./User");
require("./Contest");

const EditorialSchema = new mongoose.Schema(
    {
        creator: {
            type: ObjectId,
            ref: "User",
        },
        contest: {
            type: ObjectId,
            ref: "Contest",
        },
        problem: {
            type: String,
            required: true,
        },
        markdown: {
            type: String,
            required: true,
        },
        html: {
            type: String,
        },
        comments: [
            {
                user: {
                    type: ObjectId,
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Editorial", EditorialSchema);
