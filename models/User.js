// Import the necessary packages
const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

// import user-defidned modules
const Article = require("./Article");
const Todo = require("./Todo");
const Editorial = require("./Editorial");

// Create Schema for Article
const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        githubID: {
            type: String,
        },
        facebookID: {
            type: String,
        },
        googleID: {
            type: String,
        },
        linkedinID: {
            type: String,
        },
        name: {
            type: String,
            default: "Soldier",
        },
        picture: {
            type: String,
            default:
                "https://ui-avatars.com/api/?name=Soldier&background=random",
        },
        password: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        contribution_points: {
            type: Number,
            default: 0,
        },
        articles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: Article,
            },
        ],
        // videos: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: Video,
        //     },
        // ],
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
        editorials: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: Editorial,
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
