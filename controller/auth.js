const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");

//validate
const validateRegisterInput = require("../validation/register_validate");
const SecretCode = require("./SecretCode");
// import user-defidned modules or Schema
const User = require("../models/User");
const Todo = require("../models/Todo");

// url: `${baseUrl}/api/user/loginfacebook`;

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

exports.isAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role !== "admin") {
        res.status(401).json({
            error: true,
            errorBody: "User not authorized",
        });
    } else {
        next();
    }
};

exports.register = async (req, res) => {
    const { email, first_name, last_name, password } = req.body;
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check for validation
    if (!isValid) {
        return res.status(400).json({ error: true, errorBody: errors });
    }
    User.findOne({ email }, (err, user) => {
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Error has occured",
            });
        } else if (user)
            res.status(400).json({
                error: true,
                errorBody: "Email is already taken",
            });
        else {
            const picture =
                req.body.picture ||
                `https://ui-avatars.com/api/?name=${first_name}&background=random`;
            const newUser = new User({
                email,
                name: first_name + " " + last_name,
                picture,
                password,
            });
            newUser.save((err) => {
                if (err)
                    res.status(500).json({
                        error: true,
                        errorBody: "Error has occured",
                    });
                else {
                    SecretCode.codegen(email);
                    res.status(201).json({
                        message:
                            "Account successfully created, Please Verify Your Email Id by Clicking the Sent Link",
                        error: false,
                    });
                }
            });
        }
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        // something went wrong with database
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Error has occured",
            });
        }
        // if no user exist
        else if (!user) {
            res.status(401).json({
                error: true,
                errorBody: "Email not registered",
            });
        }
        // if no user exist
        else if (user.active === false) {
            SecretCode.codegen(user.email);
            res.status(403).json({
                error: true,
                errorBody:
                    "User Registered but Not Verified,Please Click on link sent to your email to verify",
            });
        }
        // check if password is correct
        else {
            // user.comparePassword(password, next);
            bcrypt.compare(password, user.password, function (err, match) {
                if (err) {
                    res.status(500).json({
                        error: true,
                        errorBody: "Error has occured",
                    });
                } else if (!match) {
                    res.status(401).json({
                        error: true,
                        errorBody: "Password does not match",
                    });
                } else {
                    const { _id } = user;
                    user.password = undefined;
                    const token = signToken(_id);
                    res.status(200).json({
                        isAuthenticated: true,
                        token: token,
                        user: user,
                        error: false,
                    });
                }
            });
        }
    });
};

exports.isAuthenticated = (req, res) => {
    res.status(200).json({
        isAuthenticated: true,
        error: false,
    });
};

// Facebook
exports.facebooklogin = async (req, res) => {
    const { userID, accessToken } = req.body;
    const urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;
    fetch(urlGraphFacebook, {
        method: "GET",
    })
        .then((res) => res.json())
        .then((data) => {
            // console.log("From facebook", data);
            const { email, name } = data;
            User.findOne({ email }, { password: 0 }, (err, saveduser) => {
                if (err) {
                    res.status(500).json({
                        error: true,
                        errorBody: "Internal Server Error",
                    });
                } else {
                    if (saveduser) {
                        //user already have an account
                        const token = signToken(saveduser._id);
                        res.status(200).json({
                            token,
                            user: saveduser,
                            isAuthenticated: true,
                            error: false,
                            message: "Login Successful",
                        });
                    } else {
                        //user is not registered
                        let password = email + process.env.Google_Secret;
                        bcrypt.hash(password, 12).then((hashpassword) => {
                            const newUser = new User({
                                email,
                                name,
                                facebookID: data.userID,
                                active: true,
                                picture: data.picture.data.url,
                                password: hashpassword,
                            });
                            newUser.save((err, user) => {
                                if (err)
                                    res.status(500).json({
                                        error: true,
                                        errorBody: "Internal Server Error",
                                    });
                                else {
                                    const token = signToken(user._id);
                                    user.password = undefined; //to remove password field from the user
                                    res.status(201).json({
                                        token,
                                        isAuthenticated: true,
                                        user: user,
                                        error: false,
                                        message: "Account Created Succefully",
                                    });
                                }
                            });
                        });
                    }
                }
            });
        })
        .catch((err) => {
            res.status(400).json({
                error: true,
                errorBody: err,
            });
        });
};

// Linkedin Login

// get access token
const getAccessTokenLinkedin = async (code) => {
    var myHeaders = new fetch.Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("code", code);
    urlencoded.append("redirect_uri", "http://localhost:3000/linkedin");
    urlencoded.append("client_id", process.env.LINKEDIN_KEY);
    urlencoded.append("client_secret", process.env.LINKEDIN_SECRET);

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
    };

    const response = await fetch(
        "https://www.linkedin.com/oauth/v2/accessToken",
        requestOptions
    );
    const data = await response.json();
    return data.access_token;
};

const getEmailfromLinkedin = async (access_token) => {
    var myHeaders = new fetch.Headers();
    myHeaders.append("Authorization", `Bearer ${access_token}`);

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    const response = await fetch(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        requestOptions
    );
    const data = await response.json();
    return data.elements[0]["handle~"].emailAddress;
};

const getDatafromLinkedin = async (access_token) => {
    var myHeaders = new fetch.Headers();
    myHeaders.append("Authorization", `Bearer ${access_token}`);

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    const response = await fetch(
        "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))",
        requestOptions
    );
    const data = await response.json();
    return data;
};

exports.linkedinlogin = async (req, res) => {
    const { code } = req.body.data;
    const access_token = await getAccessTokenLinkedin(code);
    const email = await getEmailfromLinkedin(access_token);
    const data = await getDatafromLinkedin(access_token);
    User.findOne({ email }, { password: 0 }, (err, saveduser) => {
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Internal Server Error",
            });
        } else {
            if (saveduser) {
                //user already have an account
                const token = signToken(saveduser._id);
                res.status(200).json({
                    token,
                    isAuthenticated: true,
                    user: saveduser,
                    error: false,
                    message: "Login Successful",
                });
            } else {
                //user is not registered
                const first_name = data.firstName.localized.en_US;
                const last_name = data.lastName.localized.en_US;
                const picture =
                    data.profilePicture["displayImage~"].elements[0]
                        .identifiers[0].identifier;
                const linkedinID = data.id;
                let password = linkedinID + process.env.Google_Secret;
                bcrypt.hash(password, 12).then((hashpassword) => {
                    const newUser = new User({
                        email,
                        name: first_name + " " + last_name,
                        linkedinID,
                        active: true,
                        picture,
                        password: hashpassword,
                    });

                    newUser.save((err, user) => {
                        if (err)
                            res.status(500).json({
                                error: true,
                                errorBody: "Internal Server Error",
                            });
                        else {
                            const token = signToken(user._id);
                            user.password = undefined; //to remove password field from the user
                            res.status(201).json({
                                token,
                                isAuthenticated: true,
                                user: user,
                                error: false,
                                message: "Account Created Succefully",
                            });
                        }
                    });
                });
            }
        }
    });
};

//google login
const ClientId = process.env.Google_ClientId;
const client = new OAuth2Client(ClientId);

exports.googlelogin = async (req, res) => {
    const { tokenId, googleId } = req.body;

    client
        .verifyIdToken({ idToken: tokenId, audience: ClientId })
        .then((response) => {
            const { email_verified, email, name, picture } = response.payload;
            if (email_verified) {
                //console.log("hiiii")
                User.findOne({ email }, { password: 0 }, (err, saveduser) => {
                    if (err) {
                        res.status(500).json({
                            error: true,
                            errorBody: "Internal Server Error",
                        });
                    } else {
                        if (saveduser) {
                            //user already have an account
                            const token = signToken(saveduser._id);
                            res.status(200).json({
                                token,
                                isAuthenticated: true,
                                error: false,
                                user: saveduser,
                                message: "Login Successful",
                            });
                        } else {
                            //user is not registered

                            let password = googleId + process.env.Google_Secret;
                            bcrypt.hash(password, 12).then((hashpassword) => {
                                const newUser = new User({
                                    email,
                                    name,
                                    googleID: googleId,
                                    active: true,
                                    picture,
                                    password: hashpassword,
                                });

                                newUser.save((err, user) => {
                                    if (err) {
                                        res.status(500).json({
                                            error: true,
                                            errorBody: "Internal Server Error",
                                        });
                                    } else {
                                        const token = signToken(user._id);
                                        user.password = undefined; //to remove password field from the user
                                        res.status(201).json({
                                            token,
                                            isAuthenticated: true,
                                            user: user,
                                            error: false,
                                            message:
                                                "Account Created Succefully",
                                        });
                                    }
                                });
                            });
                        }
                    }
                });
            } else {
                res.status(401).json({
                    error: true,
                    errorBody: "Google Account Not Verified!",
                });
            }
        });
};

//signin with github
const getAccessTokenGithub = async (code) => {
    var myHeaders = new fetch.Headers();
    myHeaders.append("Accept", "application/json");

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    const response = await fetch(
        `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
        requestOptions
    );

    const data = await response.json();
    // console.log(data);
    return data.access_token;
};

const fetchGithubData = async (access_token) => {
    var myHeaders = new fetch.Headers();
    myHeaders.append("Authorization", `token ${access_token}`);

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    const response = await fetch("https://api.github.com/user", requestOptions);
    const data = await response.json();
    return data;
};

const fetchEmailfromGithub = async (access_token) => {
    var myHeaders = new fetch.Headers();
    myHeaders.append("Authorization", `token ${access_token}`);

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    const response = await fetch(
        "https://api.github.com/user/emails",
        requestOptions
    );
    const data = await response.json();
    // console.log(data[0].email);
    return data[0].email;
};

exports.githublogin = async (req, res) => {
    const { code } = req.body;
    const access_token = await getAccessTokenGithub(code);
    const data = await fetchGithubData(access_token);
    const email = await fetchEmailfromGithub(access_token);
    if (!email) {
        res.status(401).json({
            error: true,
            errorBody: "Email not found!",
        });
    }
    User.findOne({ email }, { password: 0 }, (err, saveduser) => {
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Internal Server Error 1",
            });
        } else {
            if (saveduser) {
                //user already have an account
                const token = signToken(saveduser._id);
                res.status(200).json({
                    token,
                    isAuthenticated: true,
                    user: saveduser,
                    error: false,
                    message: "Login Successful",
                });
            } else {
                //user is not registered
                const picture = data.avatar_url;
                let password = data.id + process.env.GITHUB_CLIENT_ID;
                let name;
                if (data.name) {
                    name = data.name;
                } else {
                    name = data.login;
                }
                bcrypt.hash(password, 12).then((hashpassword) => {
                    const newUser = new User({
                        email,
                        name,
                        githubID: data.id,
                        active: true,
                        picture,
                        password: hashpassword,
                    });
                    newUser.save((err, user) => {
                        if (err) {
                            res.status(500).json({
                                error: true,
                                errorBody: "Internal Server Error 2",
                            });
                        } else {
                            const token = signToken(user._id);
                            user.password = undefined; //to remove password field from the user
                            res.status(201).json({
                                token,
                                isAuthenticated: true,
                                user: user,
                                error: false,
                                message: "Account Created Succefully",
                            });
                        }
                    });
                });
            }
        }
    });
};
