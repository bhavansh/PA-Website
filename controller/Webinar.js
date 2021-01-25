const User = require("../models/User");
const Webinar = require("../models/Webinar");

exports.createWebinar = async (req, res) => {
    try {
        const webinar = new Webinar({
            creator: req.body.userId,
            title: req.body.title,
            picture: req.body.picture,
            description: req.body.description,
            date: req.body.date,
            link: req.body.link,
        });

        await webinar.save();

        res.status(200).json({
            error: false,
            message: `${webinar.title} has been successfully created.`,
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.getWebinarbyId = async (req, res) => {
    const { webinarId } = req.params;

    try {
        const webinar = await Webinar.findById(webinarId).populate(
            "creator",
            "name"
        );

        if (!webinar) {
            res.status(404).json({
                error: true,
                errorBody: `Webinar not found.`,
            });
        }

        return res.status(200).json({
            error: false,
            webinar,
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.updateWebinar = async (req, res) => {
    const { webinarId } = req.params;

    try {
        const webinar = await Webinar.findById(webinarId).populate(
            "creator",
            "title"
        );

        if (!webinar) {
            res.status(404).json({
                error: true,
                errorBody: `Webinar not found.`,
            });
        } else {
            await webinar.updateOne({
                $set: {
                    creator: webinar.userId,
                    title: req.body.title,
                    picture: req.body.picture,
                    description: req.body.description,
                    date: req.body.date,
                    link: req.body.link,
                },
            });
        }
        res.status(200).json({
            error: false,
            message: `${webinar.title} has been successfully Updated.`,
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.deleteWebinar = async (req, res) => {
    const { webinarId } = req.params;

    try {
        const webinar = await Webinar.findById(webinarId);

        if (!webinar) {
            res.status(404).json({
                error: true,
                errorBody: `Webinar not found.`,
            });
        }

        await Webinar.findByIdAndDelete(webinarId);

        return res.status(200).json({
            error: false,
            message: `${webinar.title} was deleted successfully.`,
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.getAllWebinar = async (req, res) => {
    const webinar = await Webinar.find()
        .sort({ createdAt: -1 })
        .populate("creator", "name");
    try {
        if (!webinar) {
            res.status(404).json({
                error: true,
                errorBody: `Webinar not found.`,
            });
        } else {
            return res.status(200).json({
                error: false,
                webinar,
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};
