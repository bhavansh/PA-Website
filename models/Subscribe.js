// Import the necessary packages
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;

const SubscribersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subscribers", SubscribersSchema);
