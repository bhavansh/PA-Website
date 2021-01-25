const express = require("express");
const articleRouter = express.Router();
const passport = require("passport");

var auth = require("../controller/auth");
const Article = require("../controller/Article");

articleRouter.get("/domains", Article.getAllDomains);

articleRouter.post(
    "/domains",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    Article.addDomain
);

articleRouter.post(
    "/create",
    passport.authenticate("jwt", { session: false }), //middleware to check the authorization status of user
    auth.isAdmin,
    Article.createArticle
);

articleRouter.get("/all", Article.getAllArticles);

articleRouter.get("/domain", Article.getDomainArticles);

articleRouter.get("/", Article.getArticleById);

articleRouter.get("/domain/home", Article.getDomainArticlesByFilter);

module.exports = articleRouter;
