// Import the necessary packages
const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

// import user-defidned modules
const Article = require("./Article");
const Todo = require("./Todo");

// Create Schema for Article
const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        name: {
            first_name: {
                type: String,
                required: true,
            },
            last_name: {
                type: String,
                required: true,
            },
        },
        password: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
        todos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: Todo,
            },
        ],
        favourite_articles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: Article,
            },
        ],
    },
    { timestamps: true }
);

// With pre hook (method), we specify, before saving the document ensure to run this method
// We make use of this method, to hash the password with the help of bcrypt, if it is modified
// like at the first save, reset password, etc.
UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    } else {
        bcrypt.hash(this.password, 10, (err, HashedPassword) => {
            if (err) {
                return next(err);
            } else {
                this.password = HashedPassword;
                next();
            }
        });
    }
});

// We are attaching comparePassowrd method to our schema so that,
// we will be able to compare plaintext password with our hashed password with bcrypt
UserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return callback(err);
        if (!isMatch) return callback(null, isMatch);
        return callback(null, this);
    });
};

module.exports = mongoose.model("User", UserSchema);
