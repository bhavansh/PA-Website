const Subscibe = require("../models/Subscribe");
const Email = require("../helper/email");

exports.getAllEditorial = async (req, res) => {
    const subscriberlist = await Subscibe.find();
    try {
        if (subscriberlist.length === 0) {
            return res.status(404).json({
                error: true,
                errorBody: "No Subscribers exists.",
            });
        } else {
            // console.log(subscriberlist);
            return res.status(200).json({
                msg: "Subscribers MailingList",
                data: subscriberlist,
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.joinSubcriberList = async (req, res) => {
    try {
        const subscriberlist = await Subscibe.find({ email: req.body.email });
        console.log(subscriberlist);

        if (subscriberlist.length === 0) {
            const subscriber = new Subscibe({
                name: req.body.name,
                email: req.body.email,
            });

            await subscriber.save();

            return res.status(200).json({
                msg: `${subscriber.email} has been successfully added to mailing list.`,
            });
        }

        return res.status(400).json({
            error: true,
            errorBody: "Already in Mailing List",
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.sendMailToAll = async (req, res) => {
    const subscriberlist = await Subscibe.find();
    try {
        if (subscriberlist.length === 0) {
            return res.status(404).json({
                error: true,
                errorBody: "No Subscribers exists.",
            });
        } else {
            // console.log(subscriberlist[0].email, req.body.subject);
            subscriberlist.forEach((subscriber) => {
                Email.sendMail(subscriber.email, req.body.subject);
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};
