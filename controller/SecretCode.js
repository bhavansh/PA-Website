const crypto = require("crypto");

// import user-defidned modules or Schema
const User = require("../models/User");
const SecretCode = require("../models/SecretCode");

const email = require("./email");
const generatecode = () => {
    return crypto.randomBytes(12).toString("hex");
};

// url: `${baseUrl}/api/verify/${user._id}/${SecretCode}`;

exports.sendcode = async (req, res) => {
    let code = generatecode();

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                error: "User couldn't be found.",
            });
        }

        const redundantCodes = await SecretCode.find({ user_id: user._id });

        redundantCodes.forEach(async (secretCode) => {
            delid = secretCode._id;
            console.log(delid);
            await SecretCode.findByIdAndDelete(delid);
        });

        const secretCode = new SecretCode({
            code: code,
            email_id: req.body.email,
            user_id: user._id,
        });

        await secretCode.save();

        let link = `${process.env.BASEURL}:${process.env.PORT || 4000}${
            req.baseUrl
        }/${user._id}&${code}`;

        try {
            await email.sendLink(req.body.email, link);
        } catch (err) {
            console.log(err);
        }

        res.status(200).json({
            msg: `${req.body.email} has been sent code.`,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.verifycode = async (req, res) => {
    const id = req.params.id;
    const code = req.params.code;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                error: "User couldn't be found.",
            });
        }

        const secretCode = await SecretCode.findOne({
            user_id: user._id,
        });

        if (!secretCode) {
            return res.status(404).json({
                error: "User Code Expired, Please Generate new one",
            });
        } else if (secretCode.code === code) {
            await user.updateOne({
                $set: {
                    active: true,
                },
            });

            res.status(200).json({
                msg: ` verifed has been updated successfully.`,
            });
        }
    } catch (err) {
        console.log(err);
    }
};
