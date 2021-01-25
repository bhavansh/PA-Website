const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const fetch = require("node-fetch");

const User = require("../models/User");
const Article = require("../models/Article");
const Domain = require("../models/Domain");

exports.getAllDomains = (req, res) => {
    Domain.find({}, { articles: 0 }, (err, docs) => {
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Error has occured",
            });
        } else {
            res.status(200).json({
                error: false,
                domains: docs,
            });
        }
    });
};

exports.addDomain = (req, res) => {
    const { title, description } = req.body;
    // console.log(req.body);

    Domain.findOne({ title }, (err, doc) => {
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Error has occured",
            });
        } else if (doc) {
            res.status(409).json({
                error: true,
                errorBody: "Domain already exists!",
            });
        } else {
            const newDomain = new Domain({
                title,
                description,
            });
            newDomain.save((err, doc) => {
                if (err) {
                    res.status(500).json({
                        error: true,
                        errorBody: "Error has occured",
                    });
                } else {
                    res.status(201).json({
                        error: false,
                        domain: doc,
                        message: "Domain Created Succefully!",
                    });
                }
            });
        }
    });
};

exports.getAllArticles = (req, res) => {
    Article.find({}, { limit: 50 }, (err, articles) => {
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Internal Server Error",
            });
        } else {
            res.status(200).json({
                error: false,
                articles,
            });
        }
    });
};

const getDomains = async (domains) => {
    domains = domains.map((domain) => {
        return domain._id;
    });
    return domains;
};

exports.createArticle = async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        res.status(403).json({
            error: true,
            errorBody: "Title or Content can not be empty!",
        });
    } else {
        const domains = await getDomains(req.body.domains);
        const newArticle = new Article({
            title,
            small_description: req.body.small_description,
            content,
            picture: req.body.picture,
            author: {
                _id: req.user._id,
                authorName: req.user.name,
            },
            domains,
        });
        // console.log(newArticle);
        newArticle.save((err, article) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    errorBody: "Internal Server Error",
                });
            } else {
                domains.forEach((_id) => {
                    Domain.updateOne(
                        { _id },
                        { $push: { articles: { _id: article._id, title } } },
                        (err) => {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                });
                res.status(201).json({
                    error: false,
                    article,
                    message: "Article Created Succefully~",
                });
            }
        });
    }
};

exports.getAllArticles = (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Internal Server Error",
            });
        } else {
            res.status(200).json({
                error: false,
                articles,
            });
        }
    }).limit(20);
};

exports.getDomainArticles = (req, res) => {
    console.log(req.query);
    const { _id } = req.query;
    Domain.findOne({ _id }, (err, docs) => {
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Internal Server Error",
            });
        } else if (docs) {
            res.status(200).json({
                error: false,
                domain: docs,
            });
        } else {
            res.status(400).json({
                error: true,
                errorBody: "No such Domain Exists!",
            });
        }
    });
};

exports.getArticleById = (req, res) => {
    console.log(req.query);
    const { _id } = req.query;
    const limit = req.query.limit || 10;
    const filter = req.query.limit || "ratings";
    Article.findOne({ _id }, (err, article) => {
        if (err) {
            res.status(500).json({
                error: true,
                errorBody: "Internal Server Error",
            });
        } else if (article) {
            res.status(200).json({
                error: false,
                article,
            });
        } else {
            res.status(400).json({
                error: true,
                errorBody: "No such Article Exists!",
            });
        }
    });
};

exports.getDomainArticlesByFilter = (req, res) => {
    console.log(req.query);
    const { _id } = req.query;

    Domain.findById(_id)
        .populate({ path: "articles._id" })
        .exec((err, docs) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    errorBody: "Internal Server Error",
                    err,
                    docs,
                });
            } else {
                res.status(200).json({
                    error: false,
                    domain: docs,
                });
            }
        });

    // Domain.findOne({ _id }, (err, domain) => {
    //     if (err) {
    //         res.status(500).json({
    //             error: true,
    //             errorBody: "Internal Server Error",
    //         });
    //     } else if (domain) {
    //         res.status(200).json({
    //             error: false,
    //             domain: domain,
    //         });
    //     } else {
    //         res.status(400).json({
    //             error: true,
    //             errorBody: "No such Domain Exists!",
    //         });
    //     }
    // });
};
