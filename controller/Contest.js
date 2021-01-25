const User = require("../models/User");
const Contest = require("../models/Contest");
const Editorial = require("../models/Editorial");

exports.createContest = async (req, res) => {
    try {
        const contest = new Contest({
            creator: req.body.userId,
            title: req.body.title,
            picture: req.body.picture,
            description: req.body.description,
            problems: [],
            contestdate: req.body.date,
        });

        await contest.save();

        res.status(200).json({
            error: false,
            message: `${contest.title} has been successfully created.`,
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.getContestbyId = async (req, res) => {
    const { contestId } = req.params;

    try {
        const contest = await Contest.findById(contestId)
            .lean()
            .populate("creator", "title")
            .populate("editorial");

        if (!contest) {
            return res.status(404).json({
                error: true,
                errorBody: "No Contest exists.",
            });
        }

        return res.status(200).json({
            error: false,
            contest,
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.updateContest = async (req, res) => {
    const { contestId } = req.params;

    try {
        const contest = await Contest.findById(contestId).populate(
            "creator",
            "name"
        );

        if (!contest) {
            return res.status(404).json({
                error: true,
                errorBody: "No Contest exists.",
            });
        } else {
            await contest.updateOne({
                $set: {
                    creator: contest.creator,
                    problems: contest.problems,
                    title: req.body.title,
                    contestdate: req.body.date,
                    picture: req.body.picture
                        ? req.body.picture
                        : contest.picture,
                    description: req.body.description,
                },
            });
        }
        res.status(200).json({
            error: false,
            message: `${contest.title} has been successfully Updated.`,
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.deleteContest = async (req, res) => {
    const { contestId } = req.params;

    try {
        const contest = await Contest.findById(contestId);

        if (!contest) {
            return res.status(404).json({
                error: true,
                errorBody: "No Contest exists.",
            });
        }

        await Contest.findByIdAndDelete(contestId);

        return res.status(200).json({
            error: false,
            message: `${contest.title} was deleted successfully.`,
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.getAllContest = async (req, res) => {
    const contest = await Contest.find()
        .sort([["createdAt", -1]])
        .populate("creator", "name");
    try {
        if (!contest) {
            return res.status(404).json({
                error: true,
                errorBody: "No Contest exists.",
            });
        } else {
            return res.status(200).json({
                error: false,
                contest,
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};
