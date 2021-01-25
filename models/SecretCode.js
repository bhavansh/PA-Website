const mongoose = require("mongoose");

const SecretCode = new mongoose.Schema({
    email_id: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 600,
    },
    user_id: {
        type: String,
        required: true,
    },
});

SecretCode.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model("SecretCode", SecretCode);
