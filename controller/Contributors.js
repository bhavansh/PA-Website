// import user-defidned modules or Schema
const Contributor = require("../models/Contributor");
const User = require("../models/User");

// url: `${baseUrl}/api/contributors`;

exports.getContributors = async (req, res) => {
    Contributor.find()
        .populate("user", "email name")
        .exec(function (err, docs) {
            if (err) {
                res.status(500).json({
                    message: { msgError: true, msgBody: "Error has occured" },
                });
            } else {
                res.status(200).json(docs);
            }
        });
};

// exports.getContributors = async (req, res) => {
//     Contributor.find({}, function (err, docs) {
//         if (err) {
//             res.status(500).json({
//                 message: { msgError: true, msgBody: "Error has occured" },
//             });
//         } else {
//             console.log(docs);
//             result = docs.map((doc) => {
//                 const _id = doc.user_id;
//             });
//             res.status(200).json(docs);
//         }
//     });
// };
