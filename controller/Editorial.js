const User = require("../models/User");
const Editorial = require("../models/Editorial");
const Contest = require("../models/Contest");

const { convertmarkdown } = require("../helper/markdownconvert.js");

exports.createEditorial = async (req, res) => {
    try {
        if (req.body.contestId) {
            const html = await convertmarkdown(req.body.markdown);
            const editorial = new Editorial({
                creator: req.body.userId,
                contest: req.body.contestId,
                problem: req.body.problem,
                markdown: req.body.markdown,
                html: html,
            });
            await editorial.save();

            const user = await User.findById(req.body.userId);
            await user.editorials.push(editorial._id);
            await user.save();

            const contestId = editorial.contest;
            const contest = await Contest.findById(contestId);
            await contest.problems.push(editorial._id);
            await contest.save();

            res.status(200).json({
                error: false,
                message: `${editorial.problem} has been successfully created.`,
            });
        } else {
            res.status(404).json({
                error: true,
                errorBody: `Contest Id not found.`,
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.updateEditorial = async (req, res) => {
    const { editorialId } = req.params;
    try {
        const editorial = await Editorial.findById(editorialId);
        // .populate("creator", "name")
        // .exec();

        if (!editorial) {
            res.status(404).json({
                error: true,
                errorBody: `Editorial not found.`,
            });
        } else {
            const html = await convertmarkdown(req.body.markdown);
            await Editorial.updateOne({
                $set: {
                    creator: editorial.creator,
                    contest: editorial.contest,
                    problem: req.body.contest,
                    markdown: req.body.markdown,
                    html: html,
                    comments: editorial.comments,
                },
            });
        }
        res.status(200).json({
            error: false,
            message: `${editorial.problem} has been successfully Updated.`,
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.deleteEditorial = async (req, res) => {
    const { editorialId } = req.params;

    try {
        const editorial = await Editorial.findById(editorialId);

        if (!editorial) {
            res.status(404).json({
                error: true,
                errorBody: `Editorial not found.`,
            });
        }

        const user = await User.findById(editorial.creator);
        await user.editorials.pull(editorial._id);

        const contestId = editorial.contest;
        if (contestId) {
            const contest = await Contest.findById(contestId);
            await contest.problems.pull(editorialId);
        }

        await Editorial.findByIdAndDelete(editorialId);

        return res.status(200).json({
            error: false,
            message: `${editorial.problem} was deleted successfully.`,
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.getAllEditorial = async (req, res) => {
    const editorial = await Editorial.find()
        .sort([["createdAt", 1]])
        .populate("creator", "name");

    try {
        if (editorial.length === 0) {
            res.status(404).json({
                error: true,
                errorBody: `Editorial not found.`,
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "Editorial",
                editorial,
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.getAllEditorialbyUser = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);

    try {
        const user = await User.find({ _id: userId }).populate("editorials");
        console.log(user);

        if (!user) {
            res.status(404).json({
                error: true,
                errorBody: `Editorial not found.`,
            });
        }

        return res.status(200).json({
            error: false,
            user,
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.getEditorialbyId = async (req, res) => {
    const { editorialId } = req.params;
    // console.log(editorialId);

    try {
        const editorial = await Editorial.find({ _id: editorialId }).populate(
            "creator",
            "name"
        );
        // console.log(editorial);

        if (!editorial) {
            res.status(404).json({
                error: true,
                errorBody: `Editorial not found.`,
            });
        }

        return res.status(200).json({
            error: false,
            editorial,
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.enterComment = async (req, res) => {
    const { editorialId } = req.params;

    try {
        const editorial = await Editorial.findById(editorialId);

        if (!editorial) {
            res.status(404).json({
                error: true,
                errorBody: `Editorial not found.`,
            });
        }
        await editorial.comments.push({
            comment: req.body.comment,
            user: req.body.userId,
            userName: req.body.userName,
        });

        await editorial.save();

        return res.status(200).json({
            error: false,
            editorial,
        });
    } catch (e) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};
