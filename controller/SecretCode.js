const crypto = require("crypto");

// import user-defidned modules or Schema
const User = require("../models/User");
const SecretCode = require("../models/SecretCode");

const Email = require("../helper/email");
const generatecode = () => {
    return crypto.randomBytes(64).toString("hex");
};

exports.codegen = async (email) => {
    let code = generatecode();
    try {
        const user = await User.findOne({ email: email });
        const redundantCodes = await SecretCode.find({ user_id: user._id });
        if (redundantCodes.length > 0) {
            redundantCodes.forEach(async (secretCode) => {
                delid = secretCode._id;
                await SecretCode.findByIdAndDelete(delid);
            });
        }

        const secretCode = new SecretCode({
            code: code,
            email_id: email,
            user_id: user._id,
        });

        await secretCode.save();

        let link = `${process.env.BASEURL}:${
            process.env.PORT || 4000
        }/api/verify/${user._id}&${code}`;

        await Email.sendLink(email, link);
        return true;
    } catch (err) {
        return false;
    }
};

exports.sendcode = async (req, res) => {
    let code = generatecode();
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                error: true,
                errorBody: "No User Found.",
            });
        }

        const redundantCodes = await SecretCode.find({ user_id: user._id });
        if (redundantCodes.length > 0) {
            redundantCodes.forEach(async (secretCode) => {
                delid = secretCode._id;
                console.log(delid);
                await SecretCode.findByIdAndDelete(delid);
            });
        }

        const secretCode = new SecretCode({
            code: code,
            email_id: req.body.email,
            user_id: user._id,
        });

        await secretCode.save();
        let link = `${process.env.BASEURL}:${
            process.env.PORT || 4000
        }/api/verify/${user._id}&${code}`;

        try {
            await Email.sendLink(req.body.email, link);
        } catch (err) {
            console.log(err);
        }

        res.status(200).json({
            error: false,
            message: "Mail Sent Succefully",
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};

exports.verifycode = async (req, res) => {
    const id = req.params.id;
    const code = req.params.code;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                error: true,
                errorBody: "No User Found.",
            });
        }

        const secretCode = await SecretCode.findOne({
            user_id: user._id,
        });

        if (!secretCode) {
            return res.status(404).json({
                error: true,
                errorBody: "Code Not Found, Generate New One.",
            });
        } else if (secretCode.code === code) {
            await user.updateOne({
                $set: {
                    active: true,
                },
            });

            res.status(200).json({
                error: false,
                message: ` User Account Status has been updated successfully.`,
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: true,
            errorBody: `Internal Server Error.`,
        });
    }
};
