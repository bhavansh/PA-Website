// Import the necessary packages
const mongoose = require("mongoose");
const User = require("./User");

// Create Schema for Todo
const TodoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean, // true indicates completed and false indicates pending
            default: false,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Todo", TodoSchema);
