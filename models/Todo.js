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
            type: Boolean,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Todo", TodoSchema);
