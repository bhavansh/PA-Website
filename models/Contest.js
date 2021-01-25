// Import the necessary packages
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;

require("./User");
require("./Editorial");

const ContestSchema = new mongoose.Schema(
    {
        creator: {
            type: ObjectId,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        picture: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        },
        problems: [
            {
                type: ObjectId,
                ref: "Editorial",
            },
        ],
        contestdate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contest", ContestSchema);
