// Import the necessary packages
const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
var bcrypt = require("bcryptjs");
//validate
const validateRegisterInput = require("../validation/register_validate");
// import user-defidned modules or Schema
const User = require("../models/User");
const Todo = require("../models/Todo");
// const SecretCode = require("../models/SecretCode");

// const generatecode = () => {
//     return crypto.randomBytes(128).toString("hex");
// };

const ClientId = process.env.Google_ClientId;
const client = new OAuth2Client(ClientId);

const signToken = (userID) => {
    return JWT.sign(
        {
            iss: "Programmers_Army",
            sub: userID,
        },
        process.env.SECRETORKEY,
        { expiresIn: "1h" }
    );
};

userRouter.post("/register", (req, res) => {
    const { email, first_name, last_name, password } = req.body;
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email }, (err, user) => {
        if (err) {
            res.status(500).json({
                message: { msgError: true, msgBody: "Error has occured" },
            });
        } else if (user)
            res.status(400).json({
                message: {
                    msgError: true,
                    msgBody: "Email is already taken",
                },
            });
        else {
            const newUser = new User({
                email,
                name: {
                    first_name,
                    last_name,
                },
                password,
            });
            newUser.save((err) => {
                if (err)
                    res.status(500).json({
                        message: {
                            msgError: true,
                            msgBody: "Error has occured",
                        },
                    });
                else
                    res.status(201).json({
                        message: {
                            msgError: false,
                            msgBody: "Account successfully created",
                        },
                    });
            });
        }
    });
});

userRouter.post(
    "/login",
    passport.authenticate("local", { session: false }),
    (req, res) => {
        // This function will only be executed if the user is authenticated, otherwise
        // passport will send 401 unauthorized by default
        const { _id, email } = req.user;
        const token = signToken(_id);

        // Sending token as cookie or in the body itself is debatable
        // For now, I am sending as cookie, please review this and let me know
        // how should this be implemented
        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: true,
        });
        res.status(200).json({
            isAuthenticated: true,
            user: req.user,
            message: { msgError: false, msgBody: "Login Successful" },
        });
    }
);

userRouter.get(
    "/logout",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.clearCookie("access_token");
        res.status(200).json({
            message: { msgError: false, msgBody: "Logout Successful" },
        });
    }
);

userRouter.get(
    "/isAuthenticated",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.status(200).json({
            isAuthenticated: true,
            message: { msgError: false, msgBody: "User is Authenticated" },
        });
        // here req.user is added by passport after successful authentication
    }
);

userRouter.post(
    "/createTodo",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const newTodo = {
            title: req.body.title,
            body: req.body.body,
            status: false,
            owner: req.user._id,
        };
        console.log(newTodo);
        const todo = new Todo(newTodo);

        // const todo = new Todo(newTodo);
        todo.save((err) => {
            if (err) {
                res.status(500).json({
                    message: { msgError: true, msgBody: "Error has occured" },
                });
            } else {
                req.user.todos.push(todo); //push ObjectID of newly created todo to the user's todos array
                req.user.save((err) => {
                    if (err)
                        res.status(500).json({
                            message: {
                                msgBody: "Error has occured",
                                msgError: true,
                            },
                        });
                    else
                        res.status(200).json({
                            message: {
                                msgError: false,
                                msgBody: "Successfully Published the Article",
                            },
                        });
                });
            }
        });
    }
);

// userRouter.get(
//     "/auth/linkedin",
//     passport.authenticate("linkedin", { state: "SOME STATE" }),
//     function (req, res) {
//         // The request will be redirected to LinkedIn for authentication, so this
//         // function will not be called.
//     }
// );

// userRouter.get(
//     "/auth/linkedin/success",
//     passport.authenticate("linkedin", {
//         successRedirect: "/",
//         failureRedirect: "/login",
//     })
// );

userRouter.post("/auth/linkedin", (req, res) => {
    console.log(req);
});

// get info about user profile and the todos that person has created
// make sure this is the last route, otherwise it will be matched for other routes and will throw unotherzed access
// url: `${baseUrl}/api/user/${user._id}`;
userRouter.get(
    "/:username",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // req.params.username is the actual username form the route
        // whereas, req.user.email is the logged in user
        if (req.params.username !== req.user.email) {
            res.status(401).json({
                message: {
                    msgError: true,
                    msgBody: "User not authorized",
                },
            });
        } else {
            User.findById({ _id: req.user._id })
                .populate("todos")
                .exec((err, document) => {
                    if (err)
                        res.status(500).json({
                            message: {
                                msgError: true,
                                msgBody: "Error has occured",
                            },
                        });
                    else {
                        res.status(200).json({
                            user: req.user,
                            todos: document.todos,
                        });
                    }
                });
        }
    }
);

//signin and signup using google
userRouter.post("/logingoogle", (req, res) => {
    const { tokenId } = req.body;
    client
        .verifyIdToken({ idToken: tokenId, audience: ClientId })
        .then((response) => {
            //console.log(response.payload)
            const { email_verified, email } = response.payload;
            const first_name = response.payload.given_name || "";
            const last_name = response.payload.family_name || "";
            //  console.log(first_name)
            //  console.log(last_name)
            if (email_verified) {
                User.findOne({ email }, (err, saveduser) => {
                    if (err) {
                        console.log(1);
                        res.status(500).json({
                            message: {
                                msgError: true,
                                msgBody: "Something went wrong!",
                            },
                        });
                    } else {
                        if (saveduser) {
                            //user already have an account
                            const token = signToken(saveduser._id);

                            res.status(200).json({
                                token,
                                isAuthenticated: true,
                                message: {
                                    msgError: false,
                                    msgBody: "Login Successful",
                                },
                            });
                        } else {
                            //user is not registered
                            res.status(500).json({
                                message: {
                                    msgError: true,
                                    msgBody:
                                        "You don't have an account.You need to Signin first",
                                },
                            });
                        }
                    }
                });
            }
        });
});

userRouter.post("/signupgoogle", (req, res) => {
    const { tokenId } = req.body;
    client
        .verifyIdToken({ idToken: tokenId, audience: ClientId })
        .then((response) => {
            //console.log(response.payload)
            const { email_verified, email } = response.payload;
            const first_name = response.payload.given_name || "";
            const last_name = response.payload.family_name || "";

            if (email_verified) {
                User.findOne({ email }, (err, saveduser) => {
                    if (err) {
                        res.status(500).json({
                            message: {
                                msgError: true,
                                msgBody: "Something went wrong!",
                            },
                        });
                    } else {
                        if (saveduser) {
                            //user already have an account
                            res.status(500).json({
                                message: {
                                    msgError: true,
                                    msgBody:
                                        "You have an account.Go to login page",
                                },
                            });
                        } else {
                            //user is not registered
                            let password = email + process.env.Google_Secret;
                            bcrypt.hash(password, 12).then((hashpassword) => {
                                const newUser = new User({
                                    email,
                                    name: {
                                        first_name,
                                        last_name,
                                    },
                                    password: hashpassword,
                                });
                                newUser.save((err) => {
                                    if (err)
                                        res.status(500).json({
                                            message: {
                                                msgError: true,
                                                msgBody: "Error has occured",
                                            },
                                        });
                                    else
                                        res.status(201).json({
                                            message: {
                                                msgError: false,
                                                msgBody:
                                                    "Account successfully created",
                                            },
                                        });
                                });
                            });
                        }
                    }
                });
            }
        });
});

module.exports = userRouter;
